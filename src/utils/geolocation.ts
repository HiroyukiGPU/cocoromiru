import { Location } from '../types/emotion';

export interface GeolocationResult {
  location: Location;
  error?: string;
}

// 現在位置を取得
export const getCurrentLocation = (): Promise<GeolocationResult> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        location: { lat: 35.6762, lng: 139.6503, name: 'デフォルト位置' },
        error: '位置情報がサポートされていません',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // 逆ジオコーディング（座標から地名を取得）
        const name = await reverseGeocode(lat, lng);
        
        resolve({
          location: { lat, lng, name },
        });
      },
      (error) => {
        console.error('位置情報の取得に失敗:', error);
        resolve({
          location: { lat: 35.6762, lng: 139.6503, name: 'デフォルト位置' },
          error: '位置情報の取得に失敗しました',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// 逆ジオコーディング（Nominatim API使用）
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ja`
    );
    const data = await response.json();
    
    // 都市名を取得
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.county ||
                 '不明な場所';
    
    return city;
  } catch (error) {
    console.error('逆ジオコーディング失敗:', error);
    return `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};

