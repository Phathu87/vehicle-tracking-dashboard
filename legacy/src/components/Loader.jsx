import React from 'react';

export default function Loader() {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <div className="muted">Loading vehicles…</div>
    </div>
  );
}
