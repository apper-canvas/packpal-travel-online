import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppHeader from '../molecules/AppHeader';
import HeroSection from '../molecules/HeroSection';
import FeaturesGrid from '../organisms/FeaturesGrid';
import InfoCard from '../molecules/InfoCard';
import EmptyState from '../molecules/EmptyState';
import TripsGrid from '../organisms/TripsGrid';
import NewTripFlow from '../organisms/NewTripFlow';
import LoadingState from '../molecules/LoadingState';

function HomePageTemplate({
  trips,
  loading,
  error,
  showNewTrip,
  onNewTripClick,
  onNewTripClose,
  onTripCreated,
  onDeleteTrip
}) {
  return (
    <div className="min-h-screen">
      <AppHeader onNewTripClick={onNewTripClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />

        <AnimatePresence mode="wait">
          {showNewTrip ? (
            <motion.div
              key="new-trip-flow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <NewTripFlow onTripCreated={onTripCreated} onCancel={onNewTripClose} />
            </motion.div>
          ) : (
            <motion.div
              key="trips-list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading && trips.length === 0 ? (
                <LoadingState message="Loading your trips..." />
              ) : (
                <>
                  {error && (
                    <InfoCard type="error">
                      <p>{error}</p>
                    </InfoCard>
                  )}

                  {trips.length === 0 ? (
                    <EmptyState
                      iconName="MapPin"
                      title="Ready for your first adventure?"
                      description="Create your first trip to get personalized packing lists and never forget essentials again."
                      ctaText="Create Your First Trip"
                      onCtaClick={onNewTripClick}
                    />
                  ) : (
                    <TripsGrid trips={trips} onDeleteTrip={onDeleteTrip} />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <FeaturesGrid />
      </main>
    </div>
  );
}

export default HomePageTemplate;