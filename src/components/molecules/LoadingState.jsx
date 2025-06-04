import React from 'react';
import Spinner from '../atoms/Spinner';
import Typography from '../atoms/Typography';

function LoadingState({ message = "Loading your trips..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner />
        <Typography variant="p" className="text-surface-600">
          {message}
        </Typography>
      </div>
    </div>
  );
}

export default LoadingState;