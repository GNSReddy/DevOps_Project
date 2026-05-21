import React from 'react';

export default function StatsCard({ title, value, icon, type }) {
  return (
    <div className={`stats-card ${type}`}>
      <div className="stats-info">
        <h4>{title}</h4>
        <div className="stats-value">{value}</div>
      </div>
      <div className="stats-icon-wrapper">
        {icon}
      </div>
    </div>
  );
}
