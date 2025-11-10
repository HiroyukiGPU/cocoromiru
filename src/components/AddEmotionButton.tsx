import React from 'react';

interface AddEmotionButtonProps {
  onClick: () => void;
}

export const AddEmotionButton: React.FC<AddEmotionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="gradient-button"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: 'clamp(64px, 16vw, 80px)',
        height: 'clamp(64px, 16vw, 80px)',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: 'clamp(32px, 8vw, 40px)',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg) translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg) translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.5)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95) rotate(90deg)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg) translateY(-4px)';
      }}
    >
      +
    </button>
  );
};

