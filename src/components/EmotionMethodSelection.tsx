import React from 'react';

interface EmotionMethodSelectionProps {
    onSelect: (method: 'usage' | 'analysis') => void;
    onCancel: () => void;
}

export const EmotionMethodSelection: React.FC<EmotionMethodSelectionProps> = ({
    onSelect,
    onCancel,
}) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 60, 100, 0.9)', // Dark blue overlay
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                animation: 'fadeIn 0.3s ease',
                backdropFilter: 'blur(8px)',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2
                    style={{
                        color: 'white',
                        fontSize: 'clamp(24px, 5vw, 32px)',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        marginTop: 0,
                    }}
                >
                    ユーザーの感情を取得する方法
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        width: '100%',
                    }}
                >
                    {/* Card 1: Smartphone Usage Data */}
                    <div
                        className="card-hover"
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            minHeight: '400px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onClick={() => onSelect('usage')}
                    >
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#333' }}>
                            スマホ利用データ
                        </h3>

                        <div style={{ textAlign: 'center', color: '#555', lineHeight: '2', marginBottom: '32px', fontSize: '16px' }}>
                            <div>使用時間</div>
                            <div>通話履歴やトーン</div>
                            <div>文字入力スピード</div>
                            <div>SNS投稿頻度</div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ fontSize: '32px', color: '#ddd', marginBottom: '16px' }}>▼</div>
                            <div style={{
                                background: '#f5f5f7',
                                padding: '16px 32px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontSize: '18px',
                                width: '100%',
                                textAlign: 'center',
                            }}>
                                元気度をAI推定
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Voice/Expression Analysis */}
                    <div
                        className="card-hover"
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            minHeight: '400px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        }}
                        onClick={() => onSelect('analysis')}
                    >
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#333' }}>
                            音声・表情解析
                        </h3>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>カメラで表情解析</div>
                                <div style={{ fontSize: '20px', color: '#ddd', lineHeight: '1' }}>▼</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginTop: '4px' }}>笑顔指数</div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>
                                    マイクで声のトーン
                                    <div style={{ fontSize: '13px', color: '#777' }}>（高さ・スピード・抑揚）を分析</div>
                                </div>
                                <div style={{ fontSize: '20px', color: '#ddd', lineHeight: '1' }}>▼</div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginTop: '8px',
                                    borderBottom: '2px solid #0066cc',
                                    display: 'inline-block',
                                }}>
                                    テンション天気
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
