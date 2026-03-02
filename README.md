# Markdown Editor

Tauri v2 + React + TypeScript で構築されたデスクトップ型マークダウンエディタです。

## 機能

- 📂 ローカルディレクトリのファイルツリー表示
- ✏️ マークダウンテキストエディタ
- 👁️ リアルタイムプレビュー（GFM対応）
- 💾 ファイルの保存（Ctrl+S）
- 📄 PDFエクスポート

## 技術スタック

- **Tauri v2** - デスクトップアプリフレームワーク
- **React** + **TypeScript** - フロントエンド
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング
- **react-markdown** - マークダウン変換
- **Rust** - バックエンド（ファイルI/O）

## 開発

```bash
# 開発サーバーの起動
npm run tauri dev

# プロダクションビルド
npm run tauri build
```
