# GitHubのIssueへのファイル添付を別リポジトリのものとして扱うキーボードショートカットを提供するChrome拡張機能

[GitHubのIssue, PRへのファイル添付は別リポジトリのものとして扱える | waonpad blog](https://waonpad.github.io/blog/articles/29/)

# 使用方法

## セットアップ

```bash
bun run setup
```

## リポジトリの設定

.envファイルを編集する

## ビルド

```bash
bun run build
```

## 読み込み

chrome://extensions/ を開いてビルドしたdistディレクトリを読み込む

## 動作確認

設定したリポジトリのIssue作成や編集ページでCommand + Bを押すとスクリプトが実行され、アップロード対象のリポジトリIDが変更される

# 備考

- 最低限の機能しか実装していないため、機能追加のPRは歓迎します
- 何かあればIssueまで
- めんどくさいのでストアには公開しません
