// 感情の種類（喜怒哀楽）
export type EmotionType = 
  | 'joy'        // 喜
  | 'anger'      // 怒
  | 'sorrow'     // 哀
  | 'pleasure';  // 楽

// 感情の強度（0-100）
export type EmotionIntensity = number;

// 位置情報（緯度経度）
export interface Location {
  lat: number;  // 緯度
  lng: number;  // 経度
  name: string;
}

// 感情データ
export interface EmotionData {
  id: string;
  location: Location;
  emotion: EmotionType;
  intensity: EmotionIntensity;
  timestamp: Date;
  userName: string;
}

// 感情の色マッピング（喜怒哀楽）
export const emotionWeatherMap: Record<EmotionType, {
  icon: string;
  color: string;
  gradient: string[];
  label: string;
}> = {
  joy: {
    icon: '😊',
    color: '#049944',
    gradient: ['#049944', '#06b552'],
    label: '喜'
  },
  anger: {
    icon: '😠',
    color: '#E60013',
    gradient: ['#E60013', '#ff1a2d'],
    label: '怒'
  },
  sorrow: {
    icon: '😢',
    color: '#0169B8',
    gradient: ['#0169B8', '#0180d8'],
    label: '哀'
  },
  pleasure: {
    icon: '😄',
    color: '#F39801',
    gradient: ['#F39801', '#ffaa1a'],
    label: '楽'
  }
};

