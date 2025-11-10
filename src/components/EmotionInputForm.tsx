import React, { useState } from 'react';
import { EmotionType, emotionWeatherMap } from '../types/emotion';

interface EmotionInputFormProps {
  onSubmit: (emotion: EmotionType, intensity: number, userName: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmotionInputForm: React.FC<EmotionInputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('joy');
  const [intensity, setIntensity] = useState<number>(50);
  const [userName, setUserName] = useState<string>('');

  const emotions = Object.keys(emotionWeatherMap) as EmotionType[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('名前を入力してください');
      return;
    }
    onSubmit(selectedEmotion, intensity, userName);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onCancel}
    >
      <div
        className="glass-effect"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 48px)',
          maxWidth: '520px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
          WebkitOverflowScrolling: 'touch',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: 'clamp(22px, 5.5vw, 32px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 'clamp(20px, 5vw, 32px)',
            textAlign: 'center',
            lineHeight: '1.3',
            letterSpacing: '-0.5px',
          }}
        >
          💭 今の気持ちを教えてください
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 名前入力 */}
          <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'clamp(13px, 3vw, 14px)',
                fontWeight: 'bold',
                color: '#555',
                marginBottom: '8px',
              }}
            >
              あなたの名前
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例: 田中太郎"
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 20px)',
                fontSize: 'clamp(14px, 4vw, 16px)',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '48px',
                background: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            />
          </div>

          {/* 感情選択 */}
          <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'clamp(13px, 3vw, 14px)',
                fontWeight: 'bold',
                color: '#555',
                marginBottom: 'clamp(10px, 2.5vw, 12px)',
              }}
            >
              感情を選択
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(12px, 3vw, 16px)',
              }}
            >
              {emotions.map((emotion) => {
                const weather = emotionWeatherMap[emotion];
                const isSelected = selectedEmotion === emotion;
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => setSelectedEmotion(emotion)}
                    className="card-hover"
                    style={{
                      padding: 'clamp(18px, 4.5vw, 28px) clamp(14px, 3.5vw, 20px)',
                      border: isSelected ? `3px solid ${weather.color}` : '2px solid #e0e0e0',
                      borderRadius: '16px',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${weather.color}25, ${weather.color}35)` 
                        : 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'clamp(10px, 2.5vw, 14px)',
                      minHeight: '140px',
                      boxShadow: isSelected 
                        ? `0 8px 24px ${weather.color}40` 
                        : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(36px, 10vw, 48px)',
                      }}
                    >
                      {weather.icon}
                    </div>
                    <div
                      style={{
                        width: 'clamp(56px, 14vw, 68px)',
                        height: 'clamp(56px, 14vw, 68px)',
                        backgroundColor: weather.color,
                        border: '4px solid white',
                        borderRadius: '12px',
                        boxShadow: `0 4px 16px ${weather.color}60`,
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'clamp(20px, 5.5vw, 28px)',
                        color: weather.color,
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {weather.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 強度スライダー */}
          <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'clamp(13px, 3vw, 14px)',
                fontWeight: 'bold',
                color: '#555',
                marginBottom: '8px',
              }}
            >
              感情の強さ: {intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{
                width: '100%',
                height: 'clamp(6px, 2vw, 8px)',
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
              }}
            />
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: 'clamp(10px, 2.5vw, 12px)' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: 'clamp(12px, 3vw, 14px)',
                fontSize: 'clamp(14px, 4vw, 16px)',
                fontWeight: 'bold',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                background: 'white',
                color: '#666',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.5 : 1,
                minHeight: '44px',
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="gradient-button"
              style={{
                flex: 1,
                padding: 'clamp(14px, 3.5vw, 16px)',
                fontSize: 'clamp(15px, 4vw, 18px)',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                background: isLoading
                  ? '#ccc'
                  : `linear-gradient(135deg, ${emotionWeatherMap[selectedEmotion].color}, ${emotionWeatherMap[selectedEmotion].gradient[1]})`,
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '48px',
                boxShadow: isLoading 
                  ? 'none' 
                  : `0 4px 16px ${emotionWeatherMap[selectedEmotion].color}50`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${emotionWeatherMap[selectedEmotion].color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${emotionWeatherMap[selectedEmotion].color}50`;
                }
              }}
            >
              {isLoading ? '⏳ 位置情報取得中...' : '✨ 登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

