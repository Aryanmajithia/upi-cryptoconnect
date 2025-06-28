import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className={`${styles.flexCenter} min-h-screen bg-primary px-6`}>
      <div className="text-center">
        <h1 className="text-[120px] font-bold text-secondary mb-4">404</h1>
        <h2 className="text-[32px] font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-dimWhite text-[18px] max-w-[500px] mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button styles="bg-blue-gradient hover:bg-blue-gradient-dark">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;