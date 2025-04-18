# Active Context

## 現在の状態

- 全タブURLコピー機能 → 完成
- タブのURL順並び替え → 完成
- 全ウィンドウのタブ統合 → 完成
- **全ウィンドウ統合＆動画系/その他に自動分割機能 → 完成**
  - まず全ウィンドウを拡張呼び出し元ウィンドウに統合
  - **呼び出し元タブのURLが動画系かどうか判定**
  - **同じグループのタブはそのまま残し、異なるグループのタブだけ新規ウィンドウに移動**
  - **最後に呼び出し元ウィンドウを最前面に自動フォーカス**
  - 動画系はYouTube, Netflix, U-NEXT, **Amazonプライムビデオは`https://www.amazon.co.jp/gp/video`以下限定**
  - New Tab問題も解決済み
- UIはシンプルで縦並びボタン
- Manifest V3対応済み

## 最新コミット

- GitHubにプッシュ済み
- バージョン管理も問題なし

## 今後の課題

- 動画系ドメイン/パターンの編集UI追加
- 設定の永続化
- ドキュメント（docs/README.md）をsrc/の内容から自動生成する仕組みを追加
