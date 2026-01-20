import { EmotionData } from '../types/emotion';

const STORAGE_KEY = 'emodus_emotions';

// LocalStorageからデータを読み込む
export const loadEmotions = (): EmotionData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // 日付を復元
      return data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    }
    return [];
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    return [];
  }
};

// LocalStorageにデータを保存
export const saveEmotions = (emotions: EmotionData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emotions));
  } catch (error) {
    console.error('データの保存に失敗しました:', error);
  }
};

// 新しい感情データを追加
export const addEmotion = (emotion: EmotionData): EmotionData[] => {
  const emotions = loadEmotions();
  const newEmotions = [...emotions, emotion];
  saveEmotions(newEmotions);
  return newEmotions;
};

// 感情データを削除
export const removeEmotion = (id: string): EmotionData[] => {
  const emotions = loadEmotions();
  const newEmotions = emotions.filter((e) => e.id !== id);
  saveEmotions(newEmotions);
  return newEmotions;
};

// JSONファイルとしてエクスポート
export const exportToJSON = (emotions: EmotionData[]): void => {
  const dataStr = JSON.stringify(emotions, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `emodus_data_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// すべてのデータを削除
export const clearAllEmotions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('データの削除に失敗しました:', error);
  }
};

