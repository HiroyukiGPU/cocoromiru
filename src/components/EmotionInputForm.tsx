import React, { useState, useEffect } from 'react';
import { EmotionType, emotionWeatherMap } from '../types/emotion';

interface EmotionInputFormProps {
  onSubmit: (emotion: EmotionType, intensity: number, userName: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialEmotion?: EmotionType;
  initialIntensity?: number;
}

export const EmotionInputForm: React.FC<EmotionInputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialEmotion,
  initialIntensity,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialEmotion || 'joy');
  const [intensity, setIntensity] = useState<number>(initialIntensity || 50);
  const [userName, setUserName] = useState<string>('');

  // ローカルストレージから名前を読み込む
  useEffect(() => {
    const savedName = localStorage.getItem('cocoromiru-username');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const emotions = Object.keys(emotionWeatherMap) as EmotionType[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      // ユーザー体験向上のため、alertではなくinputにフォーカスなどを当てたいところだが、
      // 今回は簡単な揺れアニメーションなどで表現するのは少し手間なので、
      // 必須感を出すためにborder赤くするなどの制御をstateでやるのがベスト。
      // とりあえず既存に倣いalertを出すが、できればトーストにしたい。
      // 親からtoast関数をもらう形にリファクタするのは手間なので、
      // ここでは最低限alertでガードしつつ、UX的には名前入力欄を強調する。
      alert('名前を入力してください 🙏');
      return;
    }

    // 名前を保存
    localStorage.setItem('cocoromiru-username', userName.trim());

    onSubmit(selectedEmotion, intensity, userName);
  };

  const weather = emotionWeatherMap[selectedEmotion];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // 少し薄くして軽さを出す
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.2s ease',
        backdropFilter: 'blur(4px)', // 背景をぼかす
      }}
      onClick={onCancel}
    >
      <div
        className="glass-effect"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 40px)',
          maxWidth: '520px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', // バウンスするアニメーション
          WebkitOverflowScrolling: 'touch',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: 'clamp(24px, 5vw, 32px)',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '1.2em' }}>💭</span>
          <span>今の気持ちは？</span>
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 名前入力 */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#666',
                marginBottom: '8px',
                paddingLeft: '4px',
              }}
            >
              ニックネーム
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="あなたの名前"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #eee',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: '#f8f9fa',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#eee';
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* 感情選択 */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#666',
                marginBottom: '12px',
                paddingLeft: '4px',
              }}
            >
              感情を選ぶ
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {emotions.map((emotion) => {
                const w = emotionWeatherMap[emotion];
                const isSelected = selectedEmotion === emotion;
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => setSelectedEmotion(emotion)}
                    style={{
                      position: 'relative',
                      border: 'none',
                      borderRadius: '16px',
                      background: isSelected
                        ? `linear-gradient(135deg, ${w.color}20, ${w.color}30)`
                        : '#fff',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: isSelected
                        ? `inset 0 0 0 2px ${w.color}`
                        : '0 2px 8px rgba(0,0,0,0.05)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <div style={{ fontSize: '32px', lineHeight: 1 }}>{w.icon}</div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: isSelected ? w.color : '#666',
                      }}
                    >
                      {w.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 強度スライダー */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#666' }}>
                強さ
              </label>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: weather.color }}>
                {intensity}%
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  background: `linear-gradient(90deg, ${weather.color} ${intensity}%, #eee ${intensity}%)`,
                }}
              />
            </div>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                flex: '0 0 auto',
                padding: '0 20px',
                height: '48px',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                background: '#f1f3f5',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f1f3f5'}
            >
              やめる
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                height: '48px',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                background: isLoading ? '#ccc' : `linear-gradient(135deg, ${weather.color}, ${weather.gradient[1]})`,
                color: 'white',
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isLoading ? 'none' : `0 4px 12px ${weather.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 16px ${weather.color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${weather.color}40`;
                }
              }}
            >
              {isLoading ? (
                <>
                  <span className="spin">⏳</span> 送信中...
                </>
              ) : (
                '記録する'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

