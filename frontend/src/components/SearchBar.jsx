import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder }) {
  return (
    <div className="search-bar-wrapper">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="form-input search-input"
        placeholder={placeholder || "Search tasks by title or description..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="action-btn"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.2rem',
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
