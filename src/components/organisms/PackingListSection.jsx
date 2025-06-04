import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import PackingItem from '../molecules/PackingItem';
import InfoCard from '../molecules/InfoCard';
import Typography from '../atoms/Typography';
import { packingItemService, packingListService } from '../../services';

function PackingListSection({ packingList, categories, onTripCompletion }) {
  const [packingItems, setPackingItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Clothing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (packingList) {
      loadPackingItems();
    }
  }, [packingList]);

  const loadPackingItems = async () => {
    setLoading(true);
    try {
      const items = await packingItemService.getAll();
      const filteredItems = items.filter(item => item.packingListId === packingList.id);
      setPackingItems(filteredItems || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load packing items.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const newItem = await packingItemService.create({
        name: newItemName.trim(),
        category: selectedCategory,
        quantity: 1,
        isPacked: false,
        isCustom: true,
        packingListId: packingList.id
      });

      setPackingItems(prev => [...prev, newItem]);
      setNewItemName('');
      toast.success("Item added successfully!");
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      const item = packingItems.find(i => i.id === itemId);
      if (!item) return;

      const updatedItem = await packingItemService.update(itemId, {
        isPacked: !item.isPacked
      });

      const newItems = packingItems.map(i => i.id === itemId ? updatedItem : i);
      setPackingItems(newItems);

      // Update completion percentage
      const packedCount = newItems.filter(i => i.isPacked).length;
      const completionPercentage = Math.round((packedCount / newItems.length) * 100);

      await packingListService.update(packingList.id, { completionPercentage });

      if (completionPercentage === 100) {
        toast.success("🎉 Packing complete! You're ready to go!");
        if (onTripCompletion) {
          onTripCompletion(); // Notify parent of completion
        }
      }
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await packingItemService.delete(itemId);
      setPackingItems(prev => {
        const remainingItems = prev.filter(i => i.id !== itemId);
        // Recalculate percentage after deletion
        const packedCount = remainingItems.filter(i => i.isPacked).length;
        const newCompletionPercentage = remainingItems.length > 0 ? Math.round((packedCount / remainingItems.length) * 100) : 0;
        packingListService.update(packingList.id, { completionPercentage: newCompletionPercentage });
        return remainingItems;
      });
      toast.success("Item removed!");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = packingItems.filter(item => item.category === category);
    return acc;
  }, {});

  const totalItems = packingItems.length;
  const packedItems = packingItems.filter(item => item.isPacked).length;
  const completionPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  if (loading) {
    return <InfoCard type="info">Loading packing list items...</InfoCard>;
  }

  return (
    <div className="space-y-6">
      {/* Add Custom Item */}
      <div className="bg-surface-50 rounded-xl p-4">
        <Typography variant="h3" className="font-semibold text-surface-900 mb-3">Add Custom Item</Typography>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
            className="flex-1 px-3 py-2"
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
            className="px-3 py-2"
          />
          <Button
            onClick={handleAddCustomItem}
            disabled={!newItemName.trim()}
            className="px-4 py-2"
            icon="Plus"
          />
        </div>
      </div>

      {error && (
        <InfoCard type="error">
          <p>{error}</p>
        </InfoCard>
      )}

      {/* Packing List by Category */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryItems = groupedItems[category] || [];
          if (categoryItems.length === 0) return null;

          const categoryPacked = categoryItems.filter(item => item.isPacked).length;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
                  <span>{category}</span>
                  <span className="text-sm text-surface-500 bg-surface-100 px-2 py-1 rounded-full">
                    {categoryPacked}/{categoryItems.length}
                  </span>
                </Typography>
              </div>

              <div className="space-y-2">
                {categoryItems.map(item => (
                  <PackingItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggleItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-success to-primary p-6 rounded-xl text-white text-center"
        >
          <ApperIcon name="CheckCircle" className="h-16 w-16 mx-auto mb-4" />
          <Typography variant="h3" className="text-xl font-bold mb-2">🎉 All Packed!</Typography>
          <Typography variant="p" className="text-white/80">You're ready for your adventure. Have a great trip!</Typography>
        </motion.div>
      )}
    </div>
  );
}

export default PackingListSection;