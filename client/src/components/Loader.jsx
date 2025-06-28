import React from 'react';
import styles from '../style';

const Loader = () => {
  return (
    <div className={`${styles.flexCenter} min-h-screen bg-primary`}>
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 border-4 border-secondary rounded-full animate-spin border-t-transparent"></div>
        
        {/* Inner circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-4 border-blue-gradient rounded-full animate-spin border-t-transparent animation-delay-150"></div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-dimWhite text-sm font-poppins">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;