import { EmotionData } from '../types/emotion';

const API_BASE_URL = 'http://localhost:3001/api';

// 全感情データを取得
export const fetchEmotions = async (): Promise<EmotionData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions`);
    if (!response.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const data = await response.json();
    
    // 日付文字列をDateオブジェクトに変換
    return data.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('API取得エラー:', error);
    throw error;
  }
};

// 新しい感情を追加
export const addEmotionToServer = async (emotion: EmotionData): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emotion),
    });
    
    if (!response.ok) {
      throw new Error('データの追加に失敗しました');
    }
  } catch (error) {
    console.error('API追加エラー:', error);
    throw error;
  }
};

// 全データを一括アップロード
export const uploadAllEmotions = async (emotions: EmotionData[]): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emotions),
    });
    
    if (!response.ok) {
      throw new Error('データのアップロードに失敗しました');
    }
  } catch (error) {
    console.error('APIアップロードエラー:', error);
    throw error;
  }
};

// 全データを削除
export const deleteAllEmotions = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('データの削除に失敗しました');
    }
  } catch (error) {
    console.error('API削除エラー:', error);
    throw error;
  }
};

export default { fetchEmotions, addEmotionToServer, uploadAllEmotions, deleteAllEmotions };

