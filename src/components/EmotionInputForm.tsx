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
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          今の気持ちを教えてください
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 名前入力 */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
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
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            />
          </div>

          {/* 感情選択 */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#555',
                marginBottom: '12px',
              }}
            >
              感情を選択
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
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
                    style={{
                      padding: '24px 16px',
                      border: isSelected ? `4px solid ${weather.color}` : '2px solid #e0e0e0',
                      borderRadius: '16px',
                      background: isSelected ? `${weather.color}20` : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '48px',
                      }}
                    >
                      {weather.icon}
                    </div>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: weather.color,
                        border: '3px solid white',
                        boxShadow: `0 2px 8px ${weather.color}60`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '24px',
                        color: weather.color,
                        fontWeight: 'bold',
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
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
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
                height: '8px',
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: 'white',
                color: '#666',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                background: isLoading
                  ? '#ccc'
                  : `linear-gradient(135deg, ${emotionWeatherMap[selectedEmotion].color}, ${emotionWeatherMap[selectedEmotion].gradient[1]})`,
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? '位置情報取得中...' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

