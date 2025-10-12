import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: 'purple' | 'blue' | 'orange' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, color }) => {
  return (
    <div className={`dashboard-card ${color}`}>
      <div className="card-header">
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
      <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
        <span>{isPositive ? '↑' : '↓'}</span>
        <span>{change}</span>
      </div>
      <div className="card-chart">
        {/* Mini chart placeholder */}
      </div>
    </div>
  );
};

const DashboardCards: React.FC = () => {
  const metrics = [
    {
      title: 'Users',
      value: '26K',
      change: '12.4%',
      isPositive: false,
      color: 'purple' as const
    },
    {
      title: 'Income',
      value: '$6.200',
      change: '40.9%',
      isPositive: true,
      color: 'blue' as const
    },
    {
      title: 'Conversion Rate',
      value: '2.49%',
      change: '84.7%',
      isPositive: true,
      color: 'orange' as const
    },
    {
      title: 'Sessions',
      value: '44K',
      change: '23.6%',
      isPositive: false,
      color: 'red' as const
    }
  ];

  return (
    <div className="dashboard-cards">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isPositive={metric.isPositive}
          color={metric.color}
        />
      ))}
    </div>
  );
};

export default DashboardCards;
