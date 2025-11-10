import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { EmotionData, EmotionType } from '../types/emotion';
import { EmotionMarker } from './EmotionMarker';
import { ClusterMarker } from './ClusterMarker';
import { EmotionDetail } from './EmotionDetail';
import { EmotionLegend } from './EmotionLegend';
import { AddEmotionButton } from './AddEmotionButton';
import { EmotionInputForm } from './EmotionInputForm';
import { loadEmotions, addEmotion, saveEmotions, exportToJSON, clearAllEmotions } from '../utils/emotionStorage';
import { getCurrentLocation } from '../utils/geolocation';
import { clusterEmotions, ClusterData } from '../utils/clustering';
import { generate100MockData, generate5000MockData } from '../data/generateMockData';
import { startRealtimeSync, stopRealtimeSync, broadcastUpdate, listenToBroadcast, importFromJSON } from '../utils/realtimeSync';
import { fetchEmotions, addEmotionToServer, uploadAllEmotions, deleteAllEmotions } from '../utils/api';
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
  const [useServer, setUseServer] = useState(false); // サーバーモード切替

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

  const handleExportJSON = () => {
    exportToJSON(emotionData);
  };

  const handleClearData = async () => {
    if (window.confirm('すべてのデータを削除しますか？\nこの操作は取り消せません。')) {
      if (useServer) {
        await deleteAllEmotions();
        const serverData = await fetchEmotions();
        setEmotionData(serverData);
      } else {
        clearAllEmotions();
        setEmotionData([]);
        broadcastUpdate([]);
      }
      alert('すべてのデータを削除しました');
    }
  };

  const uploadLocalToServer = async () => {
    if (confirm(`現在のローカルデータ（${emotionData.length}件）をサーバーにアップロードしますか？`)) {
      try {
        await uploadAllEmotions(emotionData);
        alert('サーバーにアップロードしました！');
      } catch (error) {
        alert('アップロードに失敗しました。サーバーが起動しているか確認してください。');
      }
    }
  };

  const handleGenerate100Data = async () => {
    if (window.confirm('100人分のサンプルデータを生成しますか？\n既存のデータは上書きされます。')) {
      const mockData = generate100MockData();
      
      if (useServer) {
        await uploadAllEmotions(mockData);
        const serverData = await fetchEmotions();
        setEmotionData(serverData);
      } else {
        saveEmotions(mockData);
        setEmotionData(mockData);
        broadcastUpdate(mockData);
      }
      
      alert('100人分のデータを生成しました！');
    }
  };

  const handleGenerate5000Data = async () => {
    if (window.confirm('5000人分のサンプルデータを生成しますか？\n既存のデータは上書きされます。\n※生成に数秒かかる場合があります。')) {
      const startTime = Date.now();
      console.log('5000人分のデータ生成を開始...');
      
      // 少し遅延を入れてUIを更新
      setTimeout(async () => {
        const mockData = generate5000MockData();
        
        if (useServer) {
          await uploadAllEmotions(mockData);
          const serverData = await fetchEmotions();
          setEmotionData(serverData);
        } else {
          saveEmotions(mockData);
          setEmotionData(mockData);
          broadcastUpdate(mockData);
        }
        
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`5000人分のデータ生成完了: ${elapsedTime}秒`);
        alert(`5000人分のデータを生成しました！\n生成時間: ${elapsedTime}秒`);
      }, 100);
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedData = await importFromJSON(file);
        
        if (useServer) {
          await uploadAllEmotions(importedData);
          const serverData = await fetchEmotions();
          setEmotionData(serverData);
        } else {
          saveEmotions(importedData);
          setEmotionData(importedData);
          broadcastUpdate(importedData);
        }
        
        alert(`${importedData.length}件のデータをインポートしました！`);
      } catch (error: any) {
        alert(error.message);
      }
    }
    // ファイル入力をリセット
    event.target.value = '';
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

      {/* 統計情報 - 非表示 */}
      {false && (
      <div
        className="stats-panel glass-effect card-hover"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          borderRadius: '20px',
          padding: '20px',
          minWidth: '180px',
          maxWidth: '90vw',
          zIndex: 1000,
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: 'clamp(16px, 3.5vw, 20px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #333 0%, #666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📊</span>
          <span>統計情報</span>
        </h3>
        <div style={{ fontSize: 'clamp(12px, 2.8vw, 15px)', color: '#555' }}>
          <div style={{ 
            marginBottom: '10px', 
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: '500' }}>📍 観測地点数</span>
            <strong style={{ color: '#667eea', fontSize: 'clamp(14px, 3vw, 18px)' }}>{emotionData.length}</strong>
          </div>
          <div style={{ 
            marginBottom: '10px', 
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(4, 153, 68, 0.1), rgba(6, 181, 82, 0.1))',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: '500' }}>🔍 ズーム</span>
            <strong style={{ color: '#049944', fontSize: 'clamp(14px, 3vw, 18px)' }}>{zoom}</strong>
          </div>
          <div style={{ 
            marginBottom: '10px', 
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(230, 0, 19, 0.1), rgba(255, 26, 45, 0.1))',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: '500' }}>🔗 クラスター</span>
            <strong style={{ color: '#E60013', fontSize: 'clamp(14px, 3vw, 18px)' }}>{clusters.length}</strong>
          </div>
          <div style={{ 
            marginBottom: '16px', 
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(243, 152, 1, 0.1), rgba(255, 170, 26, 0.1))',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: '500' }}>👤 個別</span>
            <strong style={{ color: '#F39801', fontSize: 'clamp(14px, 3vw, 18px)' }}>{individuals.length}</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setUseServer(!useServer)}
              className="gradient-button"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 'clamp(12px, 2.8vw, 14px)',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                background: useServer 
                  ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' 
                  : 'linear-gradient(135deg, #757575, #9E9E9E)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: useServer 
                  ? '0 4px 16px rgba(76, 175, 80, 0.4)' 
                  : '0 4px 16px rgba(117, 117, 117, 0.3)',
                minHeight: '44px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = useServer 
                  ? '0 6px 20px rgba(76, 175, 80, 0.5)' 
                  : '0 6px 20px rgba(117, 117, 117, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = useServer 
                  ? '0 4px 16px rgba(76, 175, 80, 0.4)' 
                  : '0 4px 16px rgba(117, 117, 117, 0.3)';
              }}
            >
              {useServer ? '🌐 サーバーモード' : '💻 ローカルモード'}
            </button>
            {!useServer && (
              <button
                onClick={uploadLocalToServer}
                className="gradient-button"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 'clamp(11px, 2.5vw, 13px)',
                  fontWeight: '600',
                  border: '2px solid #03A9F4',
                  borderRadius: '12px',
                  background: 'white',
                  color: '#03A9F4',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '40px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#03A9F4';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(3, 169, 244, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#03A9F4';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ⬆️ サーバーへアップロード
              </button>
            )}
            <button
              onClick={handleGenerate5000Data}
              className="gradient-button"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 'clamp(12px, 2.8vw, 14px)',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #049944, #06b552)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(4, 153, 68, 0.4)',
                minHeight: '44px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(4, 153, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(4, 153, 68, 0.4)';
              }}
            >
              🚀 5000人データ生成
            </button>
            <button
              onClick={handleGenerate100Data}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 'clamp(11px, 2.5vw, 13px)',
                fontWeight: '600',
                border: '2px solid #049944',
                borderRadius: '12px',
                background: 'white',
                color: '#049944',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#049944';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(4, 153, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#049944';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              100人データ生成
            </button>
            <button
              onClick={handleExportJSON}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 'clamp(11px, 2.5vw, 13px)',
                fontWeight: '600',
                border: '2px solid #667eea',
                borderRadius: '12px',
                background: 'white',
                color: '#667eea',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📥 JSONエクスポート
            </button>
            <label
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 'clamp(11px, 2.5vw, 13px)',
                fontWeight: '600',
                border: '2px solid #F39801',
                borderRadius: '12px',
                background: 'white',
                color: '#F39801',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                display: 'block',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F39801';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(243, 152, 1, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#F39801';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📤 JSONインポート
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={handleClearData}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 'clamp(11px, 2.5vw, 13px)',
                fontWeight: '600',
                border: '2px solid #e60013',
                borderRadius: '12px',
                background: 'white',
                color: '#e60013',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e60013';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 0, 19, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#e60013';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🗑️ 全データ削除
            </button>
          </div>
        </div>
      </div>
      )}

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
