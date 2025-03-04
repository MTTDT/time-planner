import React from 'react';

export default function HomeMenu({ setView }) {
  return (
    <div className="home-menu">
      <button onClick={() => setView('day')} className="view-btn">
        Day View
      </button>
      <button onClick={() => setView('week')} className="view-btn">
        Week View
      </button>
      <button onClick={() => setView('month')} className="view-btn">
        Month View
      </button>
    </div>
  );
}