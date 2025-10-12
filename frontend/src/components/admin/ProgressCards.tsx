import React from 'react';

interface ProgressCardProps {
  title: string;
  value: string;
  percentage: number;
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, percentage, color }) => {
  return (
    <div className="progress-card">
      <div className="progress-info">
        <h3 className="progress-title">{title}</h3>
        <div className="progress-value">{value}</div>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ProgressCards: React.FC = () => {
  const progressData = [
    {
      title: 'Visits',
      value: '29.703 Users (40%)',
      percentage: 40,
      color: 'green' as const
    },
    {
      title: 'Unique',
      value: '24.093 Users (20%)',
      percentage: 20,
      color: 'blue' as const
    },
    {
      title: 'Pageviews',
      value: '78.706 Views (60%)',
      percentage: 60,
      color: 'yellow' as const
    },
    {
      title: 'New Users',
      value: '22.123 Users (80%)',
      percentage: 80,
      color: 'red' as const
    },
    {
      title: 'Bounce Rate',
      value: 'Average Rate (40.15%)',
      percentage: 40,
      color: 'gray' as const
    }
  ];

  return (
    <div className="progress-cards">
      {progressData.map((item, index) => (
        <ProgressCard
          key={index}
          title={item.title}
          value={item.value}
          percentage={item.percentage}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default ProgressCards;
