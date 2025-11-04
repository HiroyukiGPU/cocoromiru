import { EmotionData, EmotionType } from '../types/emotion';

// 日本の主要都市の位置（実際の緯度経度）
const locations = [
  { lat: 43.0642, lng: 141.3469, name: '札幌' },
  { lat: 38.2682, lng: 140.8694, name: '仙台' },
  { lat: 35.6762, lng: 139.6503, name: '東京' },
  { lat: 35.1815, lng: 136.9066, name: '名古屋' },
  { lat: 34.6937, lng: 135.5023, name: '大阪' },
  { lat: 34.3853, lng: 132.4553, name: '広島' },
  { lat: 33.5904, lng: 130.4017, name: '福岡' },
  { lat: 37.9026, lng: 139.0232, name: '新潟' },
  { lat: 36.5613, lng: 136.6562, name: '金沢' },
  { lat: 36.6513, lng: 138.1810, name: '長野' },
  { lat: 26.2124, lng: 127.6809, name: '那覇' },
  { lat: 39.7186, lng: 141.1527, name: '盛岡' },
  { lat: 35.4437, lng: 133.0505, name: '松江' },
  { lat: 33.8416, lng: 132.7657, name: '松山' },
  { lat: 31.5966, lng: 130.5571, name: '鹿児島' },
];

const emotions: EmotionType[] = [
  'joy', 'anger', 'sorrow', 'pleasure'
];

const userNames = [
  '田中さん', '佐藤さん', '鈴木さん', '高橋さん', '渡辺さん',
  '伊藤さん', '山本さん', '中村さん', '小林さん', '加藤さん'
];

// モックデータを生成
export const generateMockData = (): EmotionData[] => {
  return locations.map((location, index) => ({
    id: `emotion-${index}`,
    location,
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    intensity: Math.floor(Math.random() * 100),
    timestamp: new Date(),
    userName: userNames[index]
  }));
};

// リアルタイムで感情が変化するデータを生成
export const updateEmotionData = (data: EmotionData[]): EmotionData[] => {
  return data.map(item => {
    // 10%の確率で感情が変化
    if (Math.random() < 0.1) {
      return {
        ...item,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.floor(Math.random() * 100),
        timestamp: new Date()
      };
    }
    return item;
  });
};

