import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'emotions-data.json');

// ミドルウェア
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// データファイルの初期化
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
    console.log('データファイルを初期化しました');
  }
}

// 全データを取得
app.get('/api/emotions', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const emotions = JSON.parse(data);
    res.json(emotions);
  } catch (error) {
    console.error('データ取得エラー:', error);
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});

// 新しい感情を追加
app.post('/api/emotions', async (req, res) => {
  try {
    const newEmotion = req.body;
    
    // バリデーション
    if (!newEmotion.id || !newEmotion.location || !newEmotion.emotion) {
      return res.status(400).json({ error: '必須フィールドが不足しています' });
    }

    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const emotions = JSON.parse(data);
    
    emotions.push(newEmotion);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(emotions, null, 2));
    
    res.status(201).json({ message: '感情を追加しました', emotion: newEmotion });
  } catch (error) {
    console.error('データ追加エラー:', error);
    res.status(500).json({ error: 'データの追加に失敗しました' });
  }
});

// 全データを置き換え（一括アップロード用）
app.put('/api/emotions', async (req, res) => {
  try {
    const emotions = req.body;
    
    if (!Array.isArray(emotions)) {
      return res.status(400).json({ error: 'データは配列である必要があります' });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(emotions, null, 2));
    
    res.json({ message: `${emotions.length}件のデータを保存しました` });
  } catch (error) {
    console.error('データ更新エラー:', error);
    res.status(500).json({ error: 'データの更新に失敗しました' });
  }
});

// 全データを削除
app.delete('/api/emotions', async (req, res) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
    res.json({ message: 'すべてのデータを削除しました' });
  } catch (error) {
    console.error('データ削除エラー:', error);
    res.status(500).json({ error: 'データの削除に失敗しました' });
  }
});

// サーバー起動
async function startServer() {
  await initDataFile();
  
  app.listen(PORT, () => {
    console.log(`
🚀 ココロテン APIサーバーが起動しました！
📍 URL: http://localhost:${PORT}
📂 データファイル: ${DATA_FILE}
    `);
  });
}

startServer();

