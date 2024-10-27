import { browser } from "@/config/browser";
import type { Message } from "../service-worker";

const repoUrl = `https://github.com/${import.meta.env.VITE_REPO}` as const;
// 拡張機能を有効にするURLの正規表現
const matchRegexp = new RegExp(`^${repoUrl}/issues/(\\d+|new)`);
// アップロード対象のリポジトリIDを設定する属性名
const attrName = "data-upload-repository-id";
// アップロード対象のリポジトリIDを設定する要素のセレクタ
const selector = `[${attrName}]`;

// 現在のURL
let currentUrl: string | undefined = undefined;
// イベントリスナーの登録状況管理
let isEventListening = false;

// 最初に押すキー
const firstKeyCode = "MetaRight";
// 最初に押すキーが押されているかどうか
let isFirstKeyDown = false;
// 2つ目に押すキー (処理を実行するキー)
const secondKeyCode = "KeyB";

// 1つ目のキーが押されている時に2つ目のキーが押された場合にアップロード対象のリポジトリIDを変更する
// 元に戻す機能は実装していない
const keyDownListener = (event: KeyboardEvent) => {
  // 1つ目のキーが押された場合、フラグを立てて終了
  if (event.code === firstKeyCode) {
    isFirstKeyDown = true;

    return;
  }

  // 2つ目のキーが押されて、1つ目のキーが押されている場合
  if (event.code === secondKeyCode && isFirstKeyDown) {
    // アップロード対象のリポジトリID判定用の属性が設定されている要素を取得
    const elements = document.querySelectorAll(selector);

    // アップロード対象のリポジトリIDを変更する
    for (const element of elements) {
      element.setAttribute(attrName, import.meta.env.VITE_UPLOAD_REPO_ID);
    }
  }
};

// 1つ目のキーが離された場合、フラグを下げる
const keyUpListener = (event: KeyboardEvent) => {
  if (event.code === firstKeyCode) {
    isFirstKeyDown = false;
  }
};

const process = ({ newUrl }: { newUrl: string }) => {
  // 新しいURLが現在のURLと同じ場合は何もしない(複数回呼ばれてしまう事の対策)
  if (newUrl === currentUrl) return;

  // 現在のURLを新しいURLに更新
  currentUrl = newUrl;

  // 新しいURLが条件マッチしない場合
  if (!newUrl.match(matchRegexp)) {
    // イベントリスナーが登録されている場合は削除する
    if (isEventListening) {
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
      isEventListening = false;
    }

    return;
  }

  // 新しいURLが条件マッチする場合

  // イベントリスナーが登録されていない場合は登録する
  if (!isEventListening) {
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);
    isEventListening = true;
  }
};

// Service Workerからのメッセージを受け取ったら処理を実行する
browser.runtime.onMessage.addListener((message: Message) => {
  process({ newUrl: message.url });
});

// 初回実行
process({ newUrl: location.href });
