import packingItemData from '../mockData/packingItems.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let packingItems = [...packingItemData]

export const packingItemService = {
  async getAll() {
    await delay(200)
    return [...packingItems]
  },

  async getById(id) {
    await delay(150)
    const item = packingItems.find(i => i.id === id)
    return item ? { ...item } : null
  },

  async getByPackingListId(packingListId) {
    await delay(250)
    return packingItems
      .filter(i => i.packingListId === packingListId)
      .map(item => ({ ...item }))
  },

  async create(data) {
    await delay(300)
    const newItem = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    }
    packingItems.unshift(newItem)
    return { ...newItem }
  },

  async update(id, data) {
    await delay(250)
    const index = packingItems.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    packingItems[index] = { 
      ...packingItems[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    }
    return { ...packingItems[index] }
  },

  async delete(id) {
    await delay(200)
    const index = packingItems.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    packingItems.splice(index, 1)
    return true
  }
}