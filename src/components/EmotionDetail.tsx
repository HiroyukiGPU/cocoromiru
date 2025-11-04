import React from 'react';
import { EmotionData, emotionWeatherMap } from '../types/emotion';

interface EmotionDetailProps {
  data: EmotionData | null;
  onClose: () => void;
}

export const EmotionDetail: React.FC<EmotionDetailProps> = ({ data, onClose }) => {
  if (!data) return null;

  const weather = emotionWeatherMap[data.emotion];

  return (
    <div
      className="emotion-detail-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className="emotion-detail-card"
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: weather.color,
              margin: '0 auto 20px',
              border: '4px solid rgba(0, 0, 0, 0.1)',
            }}
          />
          <h2
            style={{
              fontSize: '28px',
              margin: '0 0 10px 0',
              color: weather.color,
            }}
          >
            {weather.label}
          </h2>
          <p style={{ fontSize: '18px', color: '#666', margin: '0 0 30px 0' }}>
            {data.location.name} - {data.userName}
          </p>

          <div
            style={{
              background: '#f5f5f5',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                感情の強度
              </div>
              <div style={{ position: 'relative', height: '20px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${data.intensity}%`,
                    background: `linear-gradient(90deg, ${weather.gradient[0]}, ${weather.gradient[1]})`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px', color: weather.color }}>
                {data.intensity}%
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#666' }}>
              最終更新: {data.timestamp.toLocaleTimeString('ja-JP')}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: weather.color,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

