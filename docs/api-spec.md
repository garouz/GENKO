# API仕様書 - GENKO Backend

**バージョン**: 0.1.0

## 概要

GENKOバックエンド API仕様。

## ベースURL

```
http://localhost:3000/api
```

## 詳細は README.md を参照してください

### 校正検查 API

**POST** `/api/check/manuscript`

原稿にAI自動チェックを実行します。

```json
{
  "manuscriptId": "uuid",
  "text": "校正対象のテキスト",
  "dictionaryIds": ["dict-uuid"]
}
```

### 原稿 API

- `GET /api/manuscripts` - 一覧取得
- `POST /api/manuscripts` - 新規作成
- `PUT /api/manuscripts/:id` - 更新
- `DELETE /api/manuscripts/:id` - 削除

### 用語辞書 API

- `GET /api/dictionaries` - 一覧取得
- `POST /api/dictionaries` - 新規作成
- `DELETE /api/dictionaries/:id` - 削除
