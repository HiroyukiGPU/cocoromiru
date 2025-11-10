import React from 'react';
import { emotionWeatherMap, EmotionType } from '../types/emotion';

export const EmotionLegend: React.FC = () => {
  const emotions = Object.keys(emotionWeatherMap) as EmotionType[];

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="emotion-legend glass-effect card-hover"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        borderRadius: '20px',
        padding: '16px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '0',
          marginBottom: isOpen ? '12px' : '0',
        }}
      >
        <h3
          style={{
            margin: '0',
            fontSize: 'clamp(16px, 3.5vw, 20px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #333 0%, #666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span>🎨 感情凡例</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{isOpen ? '▼' : '▲'}</span>
        </h3>
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {emotions.map((emotion) => {
            const weather = emotionWeatherMap[emotion];
            return (
              <div
                key={emotion}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: `linear-gradient(135deg, ${weather.color}15, ${weather.color}25)`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.background = `linear-gradient(135deg, ${weather.color}25, ${weather.color}35)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = `linear-gradient(135deg, ${weather.color}15, ${weather.color}25)`;
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: weather.color,
                    flexShrink: 0,
                    border: '3px solid white',
                    borderRadius: '8px',
                    boxShadow: `0 2px 8px ${weather.color}60`,
                  }}
                />
                <span style={{ 
                  fontSize: 'clamp(14px, 3vw, 16px)', 
                  color: '#333',
                  fontWeight: '600',
                }}>
                  {weather.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

