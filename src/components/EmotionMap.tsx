import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { EmotionData, EmotionType } from '../types/emotion';
import { EmotionMarker } from './EmotionMarker';
import { ClusterMarker } from './ClusterMarker';
import { EmotionDetail } from './EmotionDetail';
import { EmotionLegend } from './EmotionLegend';
import { AddEmotionButton } from './AddEmotionButton';
import { EmotionInputForm } from './EmotionInputForm';
import { loadEmotions, addEmotion, saveEmotions } from '../utils/emotionStorage';
import { getCurrentLocation } from '../utils/geolocation';
import { clusterEmotions, ClusterData } from '../utils/clustering';
import { generate5000MockData } from '../data/generateMockData';
import { startRealtimeSync, stopRealtimeSync, broadcastUpdate, listenToBroadcast } from '../utils/realtimeSync';
import { fetchEmotions, addEmotionToServer, uploadAllEmotions } from '../utils/api';
import 'leaflet/dist/leaflet.css';

// ズームレベルを監視するコンポーネント
const ZoomHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, []);
  
  return null;
};

export const EmotionMap: React.FC = () => {
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionData | null>(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [individuals, setIndividuals] = useState<EmotionData[]>([]);
  const [useServer] = useState(false); // サーバーモード切替

  useEffect(() => {
    // データの読み込み
    const loadData = async () => {
      if (useServer) {
        // サーバーモード：APIから取得
        try {
          const serverData = await fetchEmotions();
          // データが空の場合は5000人分のデータを生成
          if (serverData.length === 0) {
            console.log('初期データを生成中...（5000人分）');
            const mockData = generate5000MockData();
            await uploadAllEmotions(mockData);
            const updatedData = await fetchEmotions();
            setEmotionData(updatedData);
          } else {
            setEmotionData(serverData);
          }
        } catch (error) {
          console.error('サーバーからのデータ取得失敗、LocalStorageを使用');
          const localData = loadEmotions();
          // ローカルデータも空の場合は5000人分のデータを生成
          if (localData.length === 0) {
            console.log('初期データを生成中...（5000人分）');
            const mockData = generate5000MockData();
            saveEmotions(mockData);
            setEmotionData(mockData);
            broadcastUpdate(mockData);
          } else {
            setEmotionData(localData);
          }
        }
      } else {
        // ローカルモード：LocalStorageから取得
        const loadedData = loadEmotions();
        // データが空の場合は5000人分のデータを生成
        if (loadedData.length === 0) {
          console.log('初期データを生成中...（5000人分）');
          const mockData = generate5000MockData();
          saveEmotions(mockData);
          setEmotionData(mockData);
          broadcastUpdate(mockData);
        } else {
          setEmotionData(loadedData);
        }
      }
    };

    loadData();

    // リアルタイム同期を開始（サーバーモードでも定期取得）
    const syncFunction = useServer
      ? async () => {
          try {
            const serverData = await fetchEmotions();
            setEmotionData(serverData);
          } catch (error) {
            console.error('同期エラー:', error);
          }
        }
      : (updatedEmotions: EmotionData[]) => {
          setEmotionData(updatedEmotions);
        };

    if (useServer) {
      // サーバーモード：5秒ごとにポーリング
      const interval = setInterval(syncFunction, 5000);
      return () => clearInterval(interval);
    } else {
      // ローカルモード：既存の同期
      startRealtimeSync(syncFunction, 2000);
      const channel = listenToBroadcast(syncFunction);
      return () => {
        stopRealtimeSync();
        if (channel) channel.close();
      };
    }
  }, [useServer]);

  // ズームレベルが変わったらクラスタリングを再計算
  useEffect(() => {
    if (emotionData.length > 0) {
      const { clusters: newClusters, individuals: newIndividuals } = clusterEmotions(
        emotionData,
        zoom
      );
      setClusters(newClusters);
      setIndividuals(newIndividuals);
    }
  }, [emotionData, zoom]);

  const handleAddEmotion = async (
    emotion: EmotionType,
    intensity: number,
    userName: string
  ) => {
    setIsLoadingLocation(true);

    try {
      // 位置情報を取得
      const { location, error } = await getCurrentLocation();

      if (error) {
        alert(error);
      }

      // 新しい感情データを作成
      const newEmotion: EmotionData = {
        id: `emotion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        location,
        emotion,
        intensity,
        timestamp: new Date(),
        userName,
      };

      // データを保存
      if (useServer) {
        // サーバーに保存
        await addEmotionToServer(newEmotion);
        const serverData = await fetchEmotions();
        setEmotionData(serverData);
      } else {
        // LocalStorageに保存してブロードキャスト
        const updatedEmotions = addEmotion(newEmotion);
        setEmotionData(updatedEmotions);
        broadcastUpdate(updatedEmotions);
      }

      setShowInputForm(false);
      setIsLoadingLocation(false);

      // 成功メッセージ
      alert(`感情を登録しました！\n場所: ${location.name}`);
    } catch (error) {
      console.error('感情の登録に失敗:', error);
      alert('感情の登録に失敗しました');
      setIsLoadingLocation(false);
    }
  };


  return (
    <div
      className="emotion-map"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* ヘッダー */}
      <div
        className="header-container glass-effect"
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 1000,
          padding: '16px 32px',
          borderRadius: '20px',
          maxWidth: '90%',
          transition: 'all 0.3s ease',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(20px, 4.5vw, 36px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 6px 0',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}
        >
          💫 ココロテン - 感情アメダス
        </h1>
        <p
          style={{
            fontSize: 'clamp(12px, 2.8vw, 15px)',
            color: '#666',
            margin: 0,
            fontWeight: '500',
            opacity: 0.8,
          }}
        >
          リアルタイムで感情の変化を視覚化
        </p>
      </div>

      {/* Leaflet地図 */}
      <MapContainer
        center={[37.5, 138.0]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        {/* 白黒の軽量タイルレイヤー（CartoDB Positron） */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        
        {/* ズームレベルを監視 */}
        <ZoomHandler onZoomChange={setZoom} />

        {/* クラスターマーカー */}
        {clusters.map((cluster) => (
          <ClusterMarker
            key={cluster.id}
            cluster={cluster}
          />
        ))}

        {/* 個別の感情マーカー */}
        {individuals.map((data) => (
          <EmotionMarker
            key={data.id}
            data={data}
            onClick={() => setSelectedEmotion(data)}
          />
        ))}
      </MapContainer>

      {/* 凡例 */}
      <EmotionLegend />

      {/* プラスボタン */}
      <AddEmotionButton onClick={() => setShowInputForm(true)} />

      {/* 感情入力フォーム */}
      {showInputForm && (
        <EmotionInputForm
          onSubmit={handleAddEmotion}
          onCancel={() => setShowInputForm(false)}
          isLoading={isLoadingLocation}
        />
      )}

      {/* 詳細モーダル */}
      <EmotionDetail
        data={selectedEmotion}
        onClose={() => setSelectedEmotion(null)}
      />
    </div>
  );
};
