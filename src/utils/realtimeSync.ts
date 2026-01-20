import { EmotionData } from '../types/emotion';
import { loadEmotions, saveEmotions } from './emotionStorage';

// リアルタイム同期のためのイベントリスナー
let syncInterval: number | null = null;
let lastUpdateTime = 0;

// LocalStorageの変更を監視（他のタブとの同期）
export const startRealtimeSync = (
  onUpdate: (emotions: EmotionData[]) => void,
  intervalMs: number = 3000
): void => {
  // 既存のインターバルをクリア
  stopRealtimeSync();

  // 定期的にLocalStorageをチェック
  syncInterval = window.setInterval(() => {
    const emotions = loadEmotions();
    if (emotions.length > 0) {
      onUpdate(emotions);
    }
  }, intervalMs);

  // LocalStorageの変更イベントをリッスン（他のタブからの変更）
  window.addEventListener('storage', handleStorageChange);

  function handleStorageChange(e: StorageEvent) {
    if (e.key === 'emodus_emotions' && e.newValue) {
      try {
        const emotions = JSON.parse(e.newValue).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        onUpdate(emotions);
      } catch (error) {
        console.error('同期エラー:', error);
      }
    }
  }
};

// リアルタイム同期を停止
export const stopRealtimeSync = (): void => {
  if (syncInterval !== null) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  window.removeEventListener('storage', () => {});
};

// データをブロードキャスト（他のタブに通知）
export const broadcastUpdate = (emotions: EmotionData[]): void => {
  saveEmotions(emotions);
  lastUpdateTime = Date.now();
  
  // BroadcastChannel APIを使用（対応ブラウザのみ）
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('emodus_sync');
      channel.postMessage({
        type: 'update',
        data: emotions,
        timestamp: lastUpdateTime,
      });
      channel.close();
    } catch (error) {
      console.error('Broadcast failed:', error);
    }
  }
};

// 他のタブからのブロードキャストをリッスン
export const listenToBroadcast = (
  onUpdate: (emotions: EmotionData[]) => void
): BroadcastChannel | null => {
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('emodus_sync');
      channel.onmessage = (event) => {
        if (event.data.type === 'update' && event.data.timestamp > lastUpdateTime) {
          const emotions = event.data.data.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          onUpdate(emotions);
          lastUpdateTime = event.data.timestamp;
        }
      };
      return channel;
    } catch (error) {
      console.error('BroadcastChannel setup failed:', error);
    }
  }
  return null;
};

// JSONファイルとしてエクスポート（100人分のデータ用）
export const exportFullJSON = (emotions: EmotionData[]): void => {
  const dataStr = JSON.stringify(emotions, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const exportFileDefaultName = `emodus_full_data_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  URL.revokeObjectURL(url);
};

// JSONファイルからインポート
export const importFromJSON = (file: File): Promise<EmotionData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const emotions = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        resolve(emotions);
      } catch (error) {
        reject(new Error('JSONファイルの解析に失敗しました'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsText(file);
  });
};

