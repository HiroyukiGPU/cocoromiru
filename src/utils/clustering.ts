import { EmotionData, EmotionType } from '../types/emotion';

export interface ClusterData {
  id: string;
  lat: number;
  lng: number;
  emotions: EmotionData[];
  averageEmotion: EmotionType;
  averageIntensity: number;
  count: number;
}


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

// ズームレベルに応じたグリッドサイズ（度単位）を取得
const getGridSize = (zoom: number): number => {
  // ズームレベルに応じてグリッドサイズを調整
  // ズームが大きい（詳細）ほどグリッドは小さく（0に近い）なる
  // 日本付近（緯度35度）を想定して調整

  // zoom 18: ~10m -> 0.0001
  // zoom 10: ~2km -> 0.02
  // zoom 5: ~70km -> 0.7

  // 360 / (2^zoom) * 係数 でピクセルベースのサイズ感を出す
  // 係数を調整して、元のgetClusterDistanceの感覚に合わせる
  return 80 / Math.pow(2, zoom);
};

// データをクラスタリング (Grid-based O(N))
export const clusterEmotions = (
  emotions: EmotionData[],
  zoom: number
): { clusters: ClusterData[]; individuals: EmotionData[] } => {
  const gridSize = getGridSize(zoom);

  // ズームレベルが非常に高い場合はクラスタリングしない
  if (zoom >= 19) {
    return { clusters: [], individuals: emotions };
  }

  const clusters: ClusterData[] = [];
  const individuals: EmotionData[] = [];

  // グリッドごとのバケットを作成
  const grid: Record<string, EmotionData[]> = {};

  emotions.forEach((emotion) => {
    // 緯度経度をグリッドサイズで割ってインデックス化
    const gridY = Math.floor(emotion.location.lat / gridSize);
    // 経度は緯度によって距離が変わるが、簡易的にそのまま計算するか、補正するか。
    // ここでは簡易的に緯度35度付近の補正（/ 0.82）を入れるか、あるいは単に等角でやるか。
    // パフォーマンス優先で等角で処理し、gridSizeの方で調整する。
    const gridX = Math.floor(emotion.location.lng / gridSize);

    const key = `${gridX},${gridY}`;

    if (!grid[key]) {
      grid[key] = [];
    }
    grid[key].push(emotion);
  });

  // グリッドごとの処理
  Object.values(grid).forEach((bucket) => {
    if (bucket.length === 0) return;

    if (bucket.length === 1) {
      // 1つだけなら個別表示
      individuals.push(bucket[0]);
    } else {
      // 2つ以上ならクラスター化
      const centerLat = bucket.reduce((sum, e) => sum + e.location.lat, 0) / bucket.length;
      const centerLng = bucket.reduce((sum, e) => sum + e.location.lng, 0) / bucket.length;

      clusters.push({
        id: `cluster-${bucket[0].id}-${bucket.length}`, // IDを一意に
        lat: centerLat,
        lng: centerLng,
        emotions: bucket,
        averageEmotion: calculateAverageEmotion(bucket),
        averageIntensity: calculateAverageIntensity(bucket),
        count: bucket.length,
      });
    }
  });

  return { clusters, individuals };
};

