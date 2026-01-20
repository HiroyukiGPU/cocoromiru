import React, { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationContainerProps {
    notifications: NotificationItem[];
    onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onRemove,
}) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 9999,
                pointerEvents: 'none', // クリックが背景に抜けるように
            }}
        >
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    item={notification}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};

const Notification: React.FC<{
    item: NotificationItem;
    onRemove: (id: string) => void;
}> = ({ item, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // マウント後にフェードイン
        requestAnimationFrame(() => setIsVisible(true));

        // 3秒後に自動消滅
        const timer = setTimeout(() => {
            setIsVisible(false);
            // アニメーション終了後に削除
            setTimeout(() => onRemove(item.id), 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [item.id, onRemove]);

    const getStyles = (type: NotificationType) => {
        const base = {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            icon: 'ℹ️',
            borderLeft: '4px solid #667eea',
        };

        switch (type) {
            case 'success':
                return {
                    ...base,
                    icon: '✨',
                    borderLeft: '4px solid #48bb78',
                };
            case 'error':
                return {
                    ...base,
                    icon: '🚨',
                    borderLeft: '4px solid #f56565',
                };
            default:
                return base;
        }
    };

    const style = getStyles(item.type);

    return (
        <div
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                maxWidth: '90vw',
                padding: '16px 20px',
                borderRadius: '12px',
                background: style.background,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderLeft: style.borderLeft,
            }}
        >
            <span style={{ fontSize: '20px' }}>{style.icon}</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.message}</span>
        </div>
    );
};
