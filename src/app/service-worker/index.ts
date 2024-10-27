// URL変更時にcontent scriptにメッセージを送信する

import { browser } from "@/config/browser";

export type Message = {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  url: chrome.tabs.Tab["url"];
};

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    await browser.tabs.sendMessage(tabId, { url: tab.url } satisfies Message);
  }
});
