/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="loading-skeleton" aria-label="Loading content..." role="progressbar">
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
      <div className="skeleton-bar"></div>
    </div>
  );
};

export default LoadingSkeleton;