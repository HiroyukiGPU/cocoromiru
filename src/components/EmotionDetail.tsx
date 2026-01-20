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
        className="emotion-detail-card glass-effect"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 48px)',
          maxWidth: '520px',
          width: '95%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 'clamp(80px, 20vw, 100px)',
              height: 'clamp(80px, 20vw, 100px)',
              backgroundColor: weather.color,
              margin: '0 auto clamp(16px, 4vw, 20px)',
              border: '4px solid rgba(0, 0, 0, 0.1)',
            }}
          />
          <h2
            style={{
              fontSize: 'clamp(24px, 6.5vw, 32px)',
              margin: '0 0 clamp(10px, 2.5vw, 12px) 0',
              color: weather.color,
              fontWeight: '800',
              letterSpacing: '0.5px',
            }}
          >
            {weather.label}
          </h2>
          <p style={{ 
            fontSize: 'clamp(15px, 4vw, 19px)', 
            color: '#666', 
            margin: '0 0 clamp(24px, 6vw, 36px) 0',
            fontWeight: '500',
          }}>
            📍 {data.location.name} - 👤 {data.userName}
          </p>

          <div
            style={{
              background: `linear-gradient(135deg, ${weather.color}10, ${weather.color}20)`,
              borderRadius: '16px',
              padding: 'clamp(20px, 5vw, 28px)',
              marginBottom: 'clamp(20px, 5vw, 28px)',
              border: `2px solid ${weather.color}30`,
              boxShadow: `0 4px 16px ${weather.color}20`,
            }}
          >
            <div style={{ marginBottom: 'clamp(12px, 3vw, 15px)' }}>
              <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', marginBottom: '8px' }}>
                感情の強度
              </div>
              <div style={{ position: 'relative', height: 'clamp(16px, 4vw, 20px)', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
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
              <div style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 'bold', marginTop: '8px', color: weather.color }}>
                {data.intensity}%
              </div>
            </div>

            <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666' }}>
              最終更新: {data.timestamp.toLocaleTimeString('ja-JP')}
            </div>
          </div>

          <button
            onClick={onClose}
            className="gradient-button"
            style={{
              background: `linear-gradient(135deg, ${weather.color}, ${weather.gradient[1]})`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: 'clamp(14px, 3.5vw, 16px) clamp(36px, 9vw, 48px)',
              fontSize: 'clamp(15px, 4vw, 18px)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: '48px',
              width: '100%',
              maxWidth: '320px',
              boxShadow: `0 4px 16px ${weather.color}50`,
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${weather.color}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 16px ${weather.color}50`;
            }}
          >
            ✨ 閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

