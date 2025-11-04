import React from 'react';

interface AddEmotionButtonProps {
  onClick: () => void;
}

export const AddEmotionButton: React.FC<AddEmotionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '36px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
      }}
    >
      +
    </button>
  );
};

