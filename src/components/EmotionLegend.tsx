import React from 'react';
import { emotionWeatherMap, EmotionType } from '../types/emotion';

export const EmotionLegend: React.FC = () => {
  const emotions = Object.keys(emotionWeatherMap) as EmotionType[];

  return (
    <div
      className="emotion-legend"
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        maxWidth: '300px',
        zIndex: 100,
      }}
    >
      <h3
        style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        感情凡例
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {emotions.map((emotion) => {
          const weather = emotionWeatherMap[emotion];
          return (
            <div
              key={emotion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: weather.color,
                  flexShrink: 0,
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                }}
              />
              <span style={{ fontSize: '14px', color: '#555' }}>
                {weather.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

