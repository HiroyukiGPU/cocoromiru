import { EmotionData, EmotionType } from '../types/emotion';

// 日本全国の都市データ（100箇所）
const japanLocations = [
  // 北海道
  { lat: 43.0642, lng: 141.3469, name: '札幌市' },
  { lat: 42.7749, lng: 141.6850, name: '苫小牧市' },
  { lat: 43.1907, lng: 140.9871, name: '小樽市' },
  { lat: 42.9849, lng: 144.3814, name: '釧路市' },
  { lat: 43.9207, lng: 144.3850, name: '網走市' },
  { lat: 41.7687, lng: 140.7268, name: '函館市' },
  { lat: 43.7703, lng: 142.3650, name: '旭川市' },
  { lat: 42.6406, lng: 143.0969, name: '帯広市' },
  
  // 東北
  { lat: 40.8244, lng: 140.7400, name: '青森市' },
  { lat: 40.6025, lng: 141.2656, name: '八戸市' },
  { lat: 39.7186, lng: 141.1527, name: '盛岡市' },
  { lat: 39.2864, lng: 141.4534, name: '釜石市' },
  { lat: 38.2682, lng: 140.8694, name: '仙台市' },
  { lat: 38.9099, lng: 139.8403, name: '酒田市' },
  { lat: 38.2404, lng: 140.3633, name: '山形市' },
  { lat: 37.7503, lng: 140.4676, name: '福島市' },
  { lat: 37.4021, lng: 141.0011, name: 'いわき市' },
  { lat: 37.2420, lng: 140.3915, name: '郡山市' },
  
  // 関東
  { lat: 36.3418, lng: 140.4468, name: 'つくば市' },
  { lat: 36.3657, lng: 139.4489, name: '前橋市' },
  { lat: 36.3910, lng: 139.0606, name: '高崎市' },
  { lat: 36.5658, lng: 139.8836, name: '宇都宮市' },
  { lat: 36.9420, lng: 140.1235, name: '水戸市' },
  { lat: 35.8617, lng: 139.6455, name: 'さいたま市' },
  { lat: 35.6047, lng: 140.1233, name: '千葉市' },
  { lat: 35.6762, lng: 139.6503, name: '東京都' },
  { lat: 35.4478, lng: 139.6425, name: '横浜市' },
  { lat: 35.3894, lng: 139.3828, name: '藤沢市' },
  { lat: 35.5272, lng: 139.7025, name: '川崎市' },
  
  // 中部
  { lat: 37.9026, lng: 139.0232, name: '新潟市' },
  { lat: 37.0120, lng: 138.2350, name: '長岡市' },
  { lat: 36.6952, lng: 137.2114, name: '富山市' },
  { lat: 36.5613, lng: 136.6562, name: '金沢市' },
  { lat: 36.0650, lng: 136.2216, name: '福井市' },
  { lat: 36.6513, lng: 138.1810, name: '長野市' },
  { lat: 36.2388, lng: 138.0455, name: '上田市' },
  { lat: 35.6635, lng: 138.5682, name: '甲府市' },
  { lat: 35.1815, lng: 136.9066, name: '名古屋市' },
  { lat: 35.0394, lng: 137.0004, name: '豊田市' },
  { lat: 34.9769, lng: 137.0557, name: '岡崎市' },
  { lat: 34.7608, lng: 137.3907, name: '豊橋市' },
  { lat: 34.7303, lng: 136.5086, name: '津市' },
  { lat: 35.1802, lng: 136.9066, name: '一宮市' },
  { lat: 35.3558, lng: 136.9620, name: '岐阜市' },
  { lat: 34.9770, lng: 138.3828, name: '静岡市' },
  { lat: 34.7056, lng: 137.7346, name: '浜松市' },
  
  // 関西
  { lat: 34.9768, lng: 135.7609, name: '大津市' },
  { lat: 35.0116, lng: 135.7681, name: '京都市' },
  { lat: 34.6937, lng: 135.5023, name: '大阪市' },
  { lat: 34.6727, lng: 135.4840, name: '堺市' },
  { lat: 34.6913, lng: 135.1830, name: '神戸市' },
  { lat: 34.7353, lng: 135.3628, name: '西宮市' },
  { lat: 34.8137, lng: 135.3673, name: '宝塚市' },
  { lat: 34.6851, lng: 135.8278, name: '奈良市' },
  { lat: 34.2261, lng: 135.1675, name: '和歌山市' },
  
  // 中国
  { lat: 35.5036, lng: 134.2382, name: '鳥取市' },
  { lat: 35.4437, lng: 133.0505, name: '松江市' },
  { lat: 34.6618, lng: 133.9197, name: '岡山市' },
  { lat: 34.3963, lng: 132.4596, name: '広島市' },
  { lat: 34.1858, lng: 131.4705, name: '山口市' },
  { lat: 34.3446, lng: 132.7362, name: '呉市' },
  { lat: 33.9596, lng: 130.9408, name: '下関市' },
  
  // 四国
  { lat: 34.0658, lng: 134.5594, name: '徳島市' },
  { lat: 34.3401, lng: 134.0434, name: '高松市' },
  { lat: 33.8416, lng: 132.7657, name: '松山市' },
  { lat: 33.5597, lng: 133.5311, name: '高知市' },
  
  // 九州・沖縄
  { lat: 33.5904, lng: 130.4017, name: '福岡市' },
  { lat: 33.6064, lng: 130.4183, name: '久留米市' },
  { lat: 33.8834, lng: 130.8751, name: '北九州市' },
  { lat: 33.2382, lng: 130.2999, name: '佐賀市' },
  { lat: 32.7503, lng: 129.8777, name: '長崎市' },
  { lat: 32.7898, lng: 130.7417, name: '熊本市' },
  { lat: 33.2382, lng: 131.6126, name: '大分市' },
  { lat: 32.0023, lng: 131.2358, name: '宮崎市' },
  { lat: 31.5966, lng: 130.5571, name: '鹿児島市' },
  { lat: 26.2124, lng: 127.6809, name: '那覇市' },
  { lat: 27.7951, lng: 128.2467, name: '名護市' },
  
  // 追加都市（100箇所にするため）
  { lat: 35.4478, lng: 139.6425, name: '横須賀市' },
  { lat: 35.3900, lng: 139.4650, name: '鎌倉市' },
  { lat: 35.1268, lng: 136.9086, name: '春日井市' },
  { lat: 34.8052, lng: 135.3693, name: '伊丹市' },
  { lat: 34.7303, lng: 135.3406, name: '尼崎市' },
  { lat: 35.0394, lng: 135.7681, name: '草津市' },
  { lat: 34.9770, lng: 135.9629, name: '宇治市' },
  { lat: 35.4437, lng: 139.6380, name: '町田市' },
  { lat: 35.6269, lng: 139.3433, name: '八王子市' },
  { lat: 35.6938, lng: 139.5650, name: '練馬区' },
  { lat: 35.6762, lng: 139.7750, name: '江戸川区' },
  { lat: 35.6586, lng: 139.7454, name: '江東区' },
  { lat: 35.7148, lng: 139.7967, name: '足立区' },
  { lat: 35.7536, lng: 139.9910, name: '松戸市' },
  { lat: 35.8433, lng: 139.9086, name: '柏市' },
  { lat: 35.5272, lng: 139.7025, name: '相模原市' },
  { lat: 36.3214, lng: 139.4814, name: '太田市' },
  { lat: 34.8127, lng: 135.6828, name: '枚方市' },
  { lat: 34.6272, lng: 135.6010, name: '東大阪市' },
  { lat: 34.5734, lng: 135.6010, name: '八尾市' },
  { lat: 34.8137, lng: 135.5677, name: '豊中市' },
  { lat: 33.3583, lng: 130.8356, name: '飯塚市' },
];

const emotions: EmotionType[] = ['joy', 'anger', 'sorrow', 'pleasure'];

const firstNames = [
  '太郎', '次郎', '三郎', '花子', '美咲', '翔太', '健太', '愛', '結衣', '陽菜',
  '大輔', '拓也', '直樹', '智子', '由美', '真理', '洋子', '健二', '一郎', '優',
  '蓮', '悠', '葵', '陽菜', '結衣', '咲', '心春', '凛', '陽', '楓'
];

const lastNames = [
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '清水', '山崎',
  '森', '池田', '橋本', '阿部', '石川', '山下', '中島', '小川', '前田', '藤田'
];

// ランダムな名前を生成
const generateRandomName = (): string => {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${lastName} ${firstName}`;
};

// 日本の緯度経度の範囲
const JAPAN_BOUNDS = {
  minLat: 24.0, // 沖縄
  maxLat: 45.5, // 北海道
  minLng: 123.0, // 西端
  maxLng: 153.0, // 東端
};

// 日本国内の陸地にランダムな位置を生成（より現実的な分布）
const generateRandomLocation = (): { lat: number; lng: number; name: string } => {
  // 主要都市周辺に集中させるため、既存の都市からランダムに選択して近くに配置
  const baseCity = japanLocations[Math.floor(Math.random() * japanLocations.length)];
  
  // 基準都市から±0.2度の範囲でランダムに配置（約22km以内）
  // より狭い範囲にすることで海上への配置を防ぐ
  const latOffset = (Math.random() - 0.5) * 0.4; // ±0.2度
  const lngOffset = (Math.random() - 0.5) * 0.4; // ±0.2度
  
  const lat = Math.max(JAPAN_BOUNDS.minLat, Math.min(JAPAN_BOUNDS.maxLat, baseCity.lat + latOffset));
  const lng = Math.max(JAPAN_BOUNDS.minLng, Math.min(JAPAN_BOUNDS.maxLng, baseCity.lng + lngOffset));
  
  return {
    lat: Math.round(lat * 10000) / 10000,
    lng: Math.round(lng * 10000) / 10000,
    name: `${baseCity.name}周辺`,
  };
};

// 100人分のモックデータを生成
export const generate100MockData = (): EmotionData[] => {
  return japanLocations.map((location, index) => ({
    id: `emotion-${Date.now()}-${index}`,
    location,
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    intensity: Math.floor(Math.random() * 100),
    timestamp: new Date(Date.now() - Math.random() * 86400000), // 過去24時間内のランダムな時刻
    userName: generateRandomName(),
  }));
};

// 5000人分のモックデータを生成
export const generate5000MockData = (): EmotionData[] => {
  const data: EmotionData[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 5000; i++) {
    data.push({
      id: `emotion-${now}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      location: generateRandomLocation(),
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      intensity: Math.floor(Math.random() * 100),
      timestamp: new Date(now - Math.random() * 86400000), // 過去24時間内のランダムな時刻
      userName: generateRandomName(),
    });
  }
  
  return data;
};

