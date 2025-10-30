/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Translation } from '../i18n';

interface SelectionPopupProps {
  config: {
    text: string;
    top: number;
    left: number;
  };
  onSearch: (text: string) => void;
  onClose: () => void;
  t: Translation;
}

const SelectionPopup: React.FC<SelectionPopupProps> = ({ config, onSearch, onClose, t }) => {
  if (!config) return null;

  const handleSearch = () => {
    onSearch(config.text);
    onClose();
  };

  const truncatedText = config.text.length > 25 ? `${config.text.substring(0, 25)}...` : config.text;

  return (
    <div 
      className="selection-popup" 
      style={{ top: `${config.top}px`, left: `${config.left}px` }}
      onMouseDown={(e) => e.stopPropagation()} 
    >
      <button className="selection-popup-button" onClick={handleSearch}>
        {t.searchFor} "{truncatedText}"
      </button>
    </div>
  );
};

export default SelectionPopup;
