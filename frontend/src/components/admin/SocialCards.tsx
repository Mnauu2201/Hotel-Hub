import React from 'react';

interface SocialCardProps {
  platform: string;
  icon: string;
  color: 'facebook' | 'twitter' | 'linkedin' | 'calendar';
}

const SocialCard: React.FC<SocialCardProps> = ({ platform, icon, color }) => {
  return (
    <div className={`social-card ${color}`}>
      <div className="social-icon">{icon}</div>
      <div className="social-info">
        <h3 className="social-title">{platform}</h3>
        <div className="social-value">Click to view</div>
      </div>
    </div>
  );
};

const SocialCards: React.FC = () => {
  const socialData = [
    {
      platform: 'Facebook',
      icon: '📘',
      color: 'facebook' as const
    },
    {
      platform: 'Twitter',
      icon: '🐦',
      color: 'twitter' as const
    },
    {
      platform: 'LinkedIn',
      icon: '💼',
      color: 'linkedin' as const
    },
    {
      platform: 'Calendar',
      icon: '📅',
      color: 'calendar' as const
    }
  ];

  return (
    <div className="social-cards">
      {socialData.map((item, index) => (
        <SocialCard
          key={index}
          platform={item.platform}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default SocialCards;
