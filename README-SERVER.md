# ココロテン - サーバーセットアップガイド 🚀

## サーバーモードについて

ココロテンには2つのモードがあります：

### 1. **ローカルモード** 💻
- ブラウザのLocalStorageにデータを保存
- 自分のブラウザでのみデータが見える
- オフラインでも動作

### 2. **サーバーモード** 🌐
- 専用サーバーにデータを保存
- **みんなで同じデータを共有できる**
- リアルタイムで他の人の感情が見える

---

## サーバーのセットアップ手順

### ステップ 1: サーバーの依存関係をインストール

```bash
cd server
npm install
```

### ステップ 2: サーバーを起動

```bash
npm start
```

サーバーが起動すると以下のように表示されます：

```
🚀 ココロテン APIサーバーが起動しました！
📍 URL: http://localhost:3001
📂 データファイル: /path/to/server/emotions-data.json
```

### ステップ 3: フロントエンドを起動

別のターミナルで：

```bash
# プロジェクトルートに戻る
cd ..

# フロントエンドを起動
npm run dev
```

### ステップ 4: ブラウザでサーバーモードに切り替え

1. ブラウザで `http://localhost:5173` を開く
2. 画面上部の **「💻 ローカルモード」** ボタンをクリック
3. **「🌐 サーバーモード」** に切り替わる
4. これでみんなでデータを共有できます！

---

## 使い方

### サーバーモードでできること

#### 📍 自分の感情を投稿
- 右下の **「➕」** ボタンから感情を投稿
- サーバーに保存され、他の人にも見える

#### 👀 他の人の感情を見る
- 地図上のマーカーをクリック
- リアルタイムで更新される（5秒ごと）

#### 📝 テストデータの生成
- **「100人データ生成」** または **「5000人データ生成」** ボタン
- サーバーに一括保存される

#### ⬆️ ローカルデータをアップロード
- ローカルモードで作ったデータをサーバーに移行できる
- **「⬆️ サーバーへアップロード」** ボタン（ローカルモード時のみ表示）

---

## API エンドポイント

サーバーは以下のエンドポイントを提供します：

### GET `/api/emotions`
全感情データを取得

```bash
curl http://localhost:3001/api/emotions
```

### POST `/api/emotions`
新しい感情を追加

```bash
curl -X POST http://localhost:3001/api/emotions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "emotion-123",
    "location": {"lat": 35.6762, "lng": 139.6503, "name": "東京"},
    "emotion": "joy",
    "intensity": 80,
    "timestamp": "2025-11-04T12:00:00Z",
    "userName": "テストユーザー"
  }'
```

### PUT `/api/emotions`
全データを一括置換

```bash
curl -X PUT http://localhost:3001/api/emotions \
  -H "Content-Type: application/json" \
  -d '[...]'
```

### DELETE `/api/emotions`
全データを削除

```bash
curl -X DELETE http://localhost:3001/api/emotions
```

---

## トラブルシューティング

### サーバーに接続できない

**症状**: 「サーバーからのデータ取得失敗、LocalStorageを使用」と表示される

**解決方法**:
1. サーバーが起動しているか確認
2. `http://localhost:3001/api/emotions` にアクセスして確認
3. CORSエラーの場合は、サーバーのCORS設定を確認

### ポート3001が使用中

**解決方法**:
`server/server.js` の `PORT` を変更：

```javascript
const PORT = 3002; // 別のポートに変更
```

`src/utils/api.ts` も同様に変更：

```typescript
const API_BASE_URL = 'http://localhost:3002/api';
```

---

## デプロイ（本番環境）

### サーバーを本番環境にデプロイする場合

1. **環境変数を設定**:
   ```bash
   export PORT=3001
   export NODE_ENV=production
   ```

2. **データファイルのパスを確認**:
   `server/server.js` でデータファイルの保存場所を設定

3. **永続化**:
   - PM2などのプロセスマネージャーを使用
   - Dockerコンテナ化

4. **フロントエンドのAPI URLを変更**:
   `src/utils/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-domain.com/api';
   ```

---

## データの保存場所

### ローカルモード
- ブラウザのLocalStorage: `emotions`

### サーバーモード
- サーバーのファイルシステム: `server/emotions-data.json`
- JSONファイルに全データを保存

---

## セキュリティに関する注意

現在の実装は**開発用**です。本番環境では以下を追加してください：

- 認証・認可（ユーザーログイン）
- レート制限（スパム防止）
- データバリデーション強化
- HTTPS通信
- データベース（SQLite, PostgreSQLなど）

---

## まとめ

✅ サーバーモードで**みんなでデータを共有**  
✅ リアルタイムで**感情の変化を可視化**  
✅ シンプルなREST APIで**拡張しやすい**  

**ココロテン** - 感情を可視化する、新しい体験を。🌈

