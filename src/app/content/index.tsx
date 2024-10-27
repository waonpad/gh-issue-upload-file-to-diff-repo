import { browser } from "@/config/browser";
import type { Message } from "../service-worker";

const repoUrl = `https://github.com/${import.meta.env.VITE_REPO}` as const;
const matchRegexp = new RegExp(`^${repoUrl}/issues/(\\d+|new)`);
const attrName = "data-upload-repository-id";
const selector = `[${attrName}]`;

let currentUrl: string | undefined = undefined;
let isEventListening = false;

const firstKeyCode = "MetaRight";
let isFirstKeyDown = false;
const secondKeyCode = "KeyB";

// 1つ目のキーが押されている時に2つ目のキーが押された場合にアップロード対象のリポジトリIDを変更する
// 元に戻す機能は実装していない
const keyDownListener = (event: KeyboardEvent) => {
  if (event.code === firstKeyCode) {
    isFirstKeyDown = true;

    return;
  }

  if (event.code === secondKeyCode && isFirstKeyDown) {
    const elements = document.querySelectorAll(selector);

    // アップロード対象のリポジトリIDを変更する
    for (const element of elements) {
      element.setAttribute(attrName, import.meta.env.VITE_UPLOAD_REPO_ID);
    }
  }
};

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

browser.runtime.onMessage.addListener((message: Message) => {
  process({ newUrl: message.url });
});

process({ newUrl: location.href });
