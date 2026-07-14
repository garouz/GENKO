# GENKO - 社内校正システム

医師・看護師等の医療関係者から受領する原稿に対して、AIによる自動チェックと編集者による人的レビューを組み合わせた校正作業を支援する社内向けPWA(Progressive Web App)。

## 🎯 プロジェクト概要

- **対象ユーザー**: 社内編集者
- **主な機能**: 原稿インポート、AI自動チェック、編集者レビュー、ファイル出力
- **フェーズ1**: プロトタイプリリース

## 📋 ドキュメント

- [要件定義書](./docs/requirements.md) - 詳細な要件定義
- [実装計画](./docs/implementation-plan.md) - フェーズ1の実装仕様
- [API仕様](./docs/api-spec.md) - バックエンド API設計
- [コンポーネント設計](./docs/component-design.md) - フロントエンドコンポーネント構成

## 🚀 クイックスタート

```bash
# リポジトリのクローン
git clone https://github.com/garouz/GENKO.git
cd GENKO

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 📦 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite（ビルドツール）
- TailwindCSS（UI フレームワーク）
- Service Worker（PWA対応）

### ファイル処理
- mammoth.js（.docx 読み込み）
- jsPDF（PDF 出力）
- markdown-it（Markdown 出力）

### バックエンド
- Node.js + Express
- TypeScript

### ストレージ
- IndexedDB（クライアント側ローカルストレージ）
- SQLite / PostgreSQL（サーバー側、後日検討）

## 📁 プロジェクト構成

```
GENKO/
├── frontend/              # フロントエンド (React PWA)
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── services/      # API・ロジック
│   │   ├── store/         # 状態管理
│   │   ├── types/         # TypeScript型定義
│   │   └── App.tsx
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
├── backend/               # バックエンド (Node.js/Express)
│   ├── src/
│   │   ├── routes/        # API ルート
│   │   ├── services/      # ビジネスロジック
│   │   ├── models/        # データモデル
│   │   ├── middleware/    # ミドルウェア
│   │   └── index.ts       # エントリーポイント
│   ├── tsconfig.json
│   └── package.json
├── docs/                  # ドキュメント
│   ├── requirements.md    # 要件定義書
│   ├── implementation-plan.md
│   ├── api-spec.md
│   └── component-design.md
└── README.md
```

## 🔄 開発フロー

1. **要件定義** → 実装計画に落とし込む
2. **API仕様設計** → バックエンド実装
3. **コンポーネント設計** → フロントエンド実装
4. **統合テスト** → 本番デプロイ

## 📝 ステータス

- ✅ プロジェクト初期化
- ⏳ フェーズ1実装進行中

## 🤝 貢献

プルリクエストは大歓迎です。大きな変更を行う場合は、まずイシューを開いて変更内容をご説明ください。
