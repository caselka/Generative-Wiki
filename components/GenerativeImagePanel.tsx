/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface GenerativeImagePanelProps {
  imageUrl: string | null;
  isLoading: boolean;
  topic: string;
}

const ImageSkeleton: React.FC = () => (
    <div className="image-skeleton" aria-label="Loading image..." role="progressbar"></div>
);

const GenerativeImagePanel: React.FC<GenerativeImagePanelProps> = ({ imageUrl, isLoading, topic }) => {
    if (isLoading) {
        return (
            <div className="generative-image-panel">
                <ImageSkeleton />
            </div>
        );
    }

    if (!imageUrl) {
        return null; // Don't render anything if there's no image and not loading
    }

    return (
        <div className="generative-image-panel">
            <img src={imageUrl} alt={`AI-generated image for ${topic}`} className="generated-image" />
        </div>
    );
};

export default GenerativeImagePanel;