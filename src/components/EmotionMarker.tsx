import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { EmotionData, emotionWeatherMap } from '../types/emotion';

interface EmotionMarkerProps {
  data: EmotionData;
  onClick?: () => void;
}

export const EmotionMarker: React.FC<EmotionMarkerProps> = ({ data, onClick }) => {
  const weather = emotionWeatherMap[data.emotion];
  const baseSize = 18;
  const size = baseSize + (data.intensity / 100) * 12; // 18px〜30px

  // カスタムアイコンを作成
  const customIcon = new DivIcon({
    className: 'custom-emotion-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${weather.color};
        box-shadow: 0 2px 8px ${weather.color}60;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.8);
        cursor: pointer;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  return (
    <Marker
      position={[data.location.lat, data.location.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <Popup>
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <strong style={{ color: weather.color, fontSize: '16px' }}>
            {data.location.name}
          </strong>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            {weather.label}
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
            強度: {data.intensity}%
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

