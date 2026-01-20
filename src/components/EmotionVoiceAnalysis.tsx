import React, { useEffect, useRef, useState } from 'react';
import { EmotionType, emotionWeatherMap } from '../types/emotion';

interface EmotionVoiceAnalysisProps {
    onComplete: (emotion: EmotionType, intensity: number) => void;
    onCancel: () => void;
}

export const EmotionVoiceAnalysis: React.FC<EmotionVoiceAnalysisProps> = ({
    onComplete,
    onCancel,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [analyzing, setAnalyzing] = useState(true);
    const [result, setResult] = useState<{ emotion: EmotionType; intensity: number } | null>(null);

    useEffect(() => {
        // カメラ起動
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error('Camera/Mic access denied:', err);
                // エラー時はフォールバック（ランダム結果など）
                setTimeout(() => {
                    setResult({ emotion: 'joy', intensity: 75 });
                    setAnalyzing(false);
                }, 2000);
            });

        // 解析シミュレーション
        const timer = setTimeout(() => {
            // ランダムな結果を生成
            const emotions = Object.keys(emotionWeatherMap) as EmotionType[];
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
            const randomIntensity = Math.floor(Math.random() * 40) + 60; // 60-100%

            setResult({ emotion: randomEmotion, intensity: randomIntensity });
            setAnalyzing(false);
        }, 3500);

        return () => {
            clearTimeout(timer);
            // ストリーム停止
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleRegister = () => {
        if (result) {
            onComplete(result.emotion, result.intensity);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 2500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
            }}
        >
            <div style={{ position: 'relative', width: '100%', maxWidth: '640px', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                />

                {/* オーバーレイ */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {analyzing ? (
                        <div style={{ textAlign: 'center' }}>
                            <div className="spin" style={{ fontSize: '48px', marginBottom: '16px' }}>💠</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>解析中...</div>
                            <div style={{ fontSize: '14px', opacity: 0.8 }}>表情と声を分析しています</div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ fontSize: '64px', marginBottom: '8px' }}>
                                {result && emotionWeatherMap[result.emotion].icon}
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.5)', marginBottom: '8px' }}>
                                {result && emotionWeatherMap[result.emotion].label}
                            </div>
                            <div style={{ fontSize: '20px', color: result ? emotionWeatherMap[result.emotion].color : 'white' }}>
                                強度: {result?.intensity}%
                            </div>
                        </div>
                    )}
                </div>

                {/* スキャンラインエフェクト */}
                {analyzing && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: '#00ffcc',
                            boxShadow: '0 0 10px #00ffcc',
                            animation: 'scan 2s linear infinite',
                        }}
                    />
                )}
            </div>

            <style>
                {`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}
            </style>

            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    キャンセル
                </button>
                {!analyzing && result && (
                    <button
                        onClick={handleRegister}
                        style={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,114,255,0.4)',
                        }}
                    >
                        この結果で記録
                    </button>
                )}
            </div>
        </div>
    );
};
