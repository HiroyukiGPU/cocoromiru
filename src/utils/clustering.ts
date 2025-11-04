import { EmotionData, EmotionType, emotionWeatherMap } from '../types/emotion';

export interface ClusterData {
  id: string;
  lat: number;
  lng: number;
  emotions: EmotionData[];
  averageEmotion: EmotionType;
  averageIntensity: number;
  count: number;
}

// 2点間の距離を計算（km）
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 感情の数値化（クラスタリング用）
const emotionToValue = (emotion: EmotionType): number => {
  const mapping: Record<EmotionType, number> = {
    joy: 1,
    anger: 2,
    sorrow: 3,
    pleasure: 4,
  };
  return mapping[emotion];
};

// 数値を感情に変換
const valueToEmotion = (value: number): EmotionType => {
  const emotions: EmotionType[] = ['joy', 'anger', 'sorrow', 'pleasure'];
  const index = Math.round(value) - 1;
  return emotions[Math.max(0, Math.min(emotions.length - 1, index))];
};

// 平均感情を計算
const calculateAverageEmotion = (emotions: EmotionData[]): EmotionType => {
  if (emotions.length === 0) return 'joy';
  
  const sum = emotions.reduce((acc, e) => acc + emotionToValue(e.emotion), 0);
  const average = sum / emotions.length;
  
  return valueToEmotion(average);
};

// 平均強度を計算
const calculateAverageIntensity = (emotions: EmotionData[]): number => {
  if (emotions.length === 0) return 0;
  
  const sum = emotions.reduce((acc, e) => acc + e.intensity, 0);
  return Math.round(sum / emotions.length);
};

// ズームレベルに応じたクラスタリング距離を取得（km）
const getClusterDistance = (zoom: number): number => {
  if (zoom >= 13) return 0; // ズーム13以上は個別表示
  if (zoom >= 12) return 3; // 3km圏内をクラスタリング
  if (zoom >= 11) return 5; // 5km圏内をクラスタリング
  if (zoom >= 10) return 8; // 8km圏内をクラスタリング
  if (zoom >= 9) return 12; // 12km圏内をクラスタリング
  if (zoom >= 8) return 18; // 18km圏内をクラスタリング
  if (zoom >= 7) return 25; // 25km圏内をクラスタリング
  if (zoom >= 6) return 35; // 35km圏内をクラスタリング
  if (zoom >= 5) return 48; // 48km圏内をクラスタリング
  if (zoom >= 4) return 65; // 65km圏内をクラスタリング
  return 85; // 85km圏内をクラスタリング
};

// データをクラスタリング
export const clusterEmotions = (
  emotions: EmotionData[],
  zoom: number
): { clusters: ClusterData[]; individuals: EmotionData[] } => {
  const clusterDistance = getClusterDistance(zoom);
  
  // ズームレベルが高い場合は個別表示
  if (clusterDistance === 0) {
    return { clusters: [], individuals: emotions };
  }
  
  const clusters: ClusterData[] = [];
  const processed = new Set<string>();
  
  emotions.forEach((emotion) => {
    if (processed.has(emotion.id)) return;
    
    // 近くのポイントを探す
    const nearby = emotions.filter((e) => {
      if (processed.has(e.id)) return false;
      const distance = getDistance(
        emotion.location.lat,
        emotion.location.lng,
        e.location.lat,
        e.location.lng
      );
      return distance <= clusterDistance;
    });
    
    // クラスターを作成
    if (nearby.length > 1) {
      // 中心座標を計算
      const centerLat = nearby.reduce((sum, e) => sum + e.location.lat, 0) / nearby.length;
      const centerLng = nearby.reduce((sum, e) => sum + e.location.lng, 0) / nearby.length;
      
      clusters.push({
        id: `cluster-${emotion.id}`,
        lat: centerLat,
        lng: centerLng,
        emotions: nearby,
        averageEmotion: calculateAverageEmotion(nearby),
        averageIntensity: calculateAverageIntensity(nearby),
        count: nearby.length,
      });
      
      nearby.forEach((e) => processed.add(e.id));
    }
  });
  
  // クラスタリングされなかった個別のマーカー
  const individuals = emotions.filter((e) => !processed.has(e.id));
  
  return { clusters, individuals };
};

