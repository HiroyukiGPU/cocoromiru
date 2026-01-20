import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { ClusterData } from '../utils/clustering';
import { emotionWeatherMap } from '../types/emotion';

interface ClusterMarkerProps {
  cluster: ClusterData;
  onClick?: () => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ cluster, onClick }) => {
  const weather = emotionWeatherMap[cluster.averageEmotion];
  // 固定サイズ（人数やズームレベルに関係なく同じサイズ）
  const size = 28;

  // カスタムアイコンを作成（四角形）
  const customIcon = new DivIcon({
    className: 'custom-cluster-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${weather.color};
        border: 3px solid white;
        box-shadow: 0 4px 16px ${weather.color}80;
        cursor: pointer;
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  return (
    <Marker
      position={[cluster.lat, cluster.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <Popup>
        <div style={{ textAlign: 'center', minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: weather.color,
                border: '3px solid white',
                boxShadow: `0 2px 8px ${weather.color}60`,
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <strong style={{ color: weather.color, fontSize: '24px', display: 'block' }}>
                {weather.label}
              </strong>
              <div style={{ fontSize: '14px', color: '#666' }}>
                地域の平均
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '14px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>人数:</strong></span>
              <span style={{ color: weather.color, fontWeight: 'bold' }}>{cluster.count}人</span>
            </div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>平均強度:</strong></span>
              <span>{cluster.averageIntensity}%</span>
            </div>
          </div>
          
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
            💡 ズームインすると個別の感情が見えます
          </div>
          
          {/* 感情の内訳 */}
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px', 
            borderTop: '1px solid #e0e0e0',
            fontSize: '12px',
            textAlign: 'left'
          }}>
            <strong>内訳:</strong>
            <div style={{ marginTop: '8px' }}>
              {cluster.emotions.slice(0, 5).map((emotion) => {
                const emotionWeather = emotionWeatherMap[emotion.emotion];
                return (
                  <div key={emotion.id} style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: emotionWeather.color,
                        flexShrink: 0,
                      }}
                    />
                    <span>{emotion.userName}: {emotionWeather.label}</span>
                  </div>
                );
              })}
              {cluster.count > 5 && (
                <div style={{ color: '#999', marginTop: '8px', textAlign: 'center' }}>
                  他 {cluster.count - 5}人...
                </div>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

