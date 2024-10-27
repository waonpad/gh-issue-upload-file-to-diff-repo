import { browser } from "@/config/browser";

export type Message = {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  url: chrome.tabs.Tab["url"];
};

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // URLが変更された場合、Content Scriptにそれを通知する
  if (changeInfo.status === "complete") {
    await browser.tabs.sendMessage(tabId, { url: tab.url } satisfies Message);
  }
});
