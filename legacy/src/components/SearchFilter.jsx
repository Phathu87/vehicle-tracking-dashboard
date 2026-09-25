import React from 'react';

export default function SearchFilter({ value, onChange }) {
  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search Vehicle ID..."
        aria-label="Search Vehicle ID"
      />
      <button type="button">Filter</button>
    </div>
  );
}
