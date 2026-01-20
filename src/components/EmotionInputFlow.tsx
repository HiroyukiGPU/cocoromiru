import React, { useState } from 'react';
import { EmotionType } from '../types/emotion';
import { EmotionMethodSelection } from './EmotionMethodSelection';
import { EmotionInputForm } from './EmotionInputForm';
import { EmotionVoiceAnalysis } from './EmotionVoiceAnalysis';

interface EmotionInputFlowProps {
    onSubmit: (emotion: EmotionType, intensity: number, userName: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

type FlowStep = 'selection' | 'manual' | 'analysis';

export const EmotionInputFlow: React.FC<EmotionInputFlowProps> = ({
    onSubmit,
    onCancel,
    isLoading,
}) => {
    const [step, setStep] = useState<FlowStep>('selection');
    const [prefill, setPrefill] = useState<{ emotion?: EmotionType; intensity?: number }>({});
    const [isEstimating, setIsEstimating] = useState(false);

    const handleSelectMethod = (method: 'usage' | 'analysis') => {
        if (method === 'usage') {
            setIsEstimating(true);
            // Simulate acquiring usage data
            setTimeout(() => {
                const emotions: EmotionType[] = ['joy', 'anger', 'sorrow', 'pleasure'];
                const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
                const randomIntensity = Math.floor(Math.random() * 30) + 50; // 50-80%

                setPrefill({ emotion: randomEmotion, intensity: randomIntensity });
                setIsEstimating(false);
                setStep('manual');
            }, 2000);
        } else {
            setStep('analysis');
        }
    };

    const handleAnalysisComplete = (emotion: EmotionType, intensity: number) => {
        setPrefill({ emotion, intensity });
        setStep('manual');
    };

    // 選択画面でのキャセルはフロー全体のキャンセル
    const handleSelectionCancel = () => {
        onCancel();
    };

    // 入力/解析画面でのキャンセルは選択画面に戻る
    const handleSubStepCancel = () => {
        setStep('selection');
    };

    // 簡易ローディング表示（スマホデータ取得中）
    if (isEstimating) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                }}
            >
                <div className="spin" style={{ fontSize: '48px', marginBottom: '24px' }}>📡</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>スマホ利用データを分析中...</div>
                <div style={{ marginTop: '8px', opacity: 0.8 }}>文字入力速度 / SNS利用頻度 / 通話履歴</div>
            </div>
        );
    }

    if (step === 'selection') {
        return <EmotionMethodSelection onSelect={handleSelectMethod} onCancel={handleSelectionCancel} />;
    }

    if (step === 'analysis') {
        return (
            <EmotionVoiceAnalysis
                onComplete={handleAnalysisComplete}
                onCancel={handleSubStepCancel}
            />
        );
    }

    return (
        <EmotionInputForm
            onSubmit={onSubmit}
            onCancel={handleSubStepCancel}
            isLoading={isLoading}
            initialEmotion={prefill.emotion}
            initialIntensity={prefill.intensity}
        />
    );
};
