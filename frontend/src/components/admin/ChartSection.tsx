import React, { useState } from 'react';


const ChartSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Month');

  const tabs = ['Day', 'Month', 'Year'];


  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2 className="chart-title">Traffic January - July 2023</h2>
        <div className="chart-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`chart-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container">
        <div>
          📊 Chart visualization would go here
          <br />
          <small>January - July 2023 Traffic Data</small>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
