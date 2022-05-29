import { store } from "./firebaseConfig";
import { chromeCommands } from "./packs/chrome";

export async function getBookmarks() {
  const bookmarks = [];

  function dumpNode(node) {
    if (node.url) {
      bookmarks.push({ url: node.url, label: `Bookmarks: ${node.title}` });
    } else if (node.children) {
      node.children.forEach((child) => dumpNode(child));
    }
  }

  function dumpTreeNodes(bookmarkNodes) {
    bookmarkNodes.forEach(dumpNode);
  }

  const bookmarkTreeNodes = await chrome.bookmarks.getTree();
  dumpTreeNodes(bookmarkTreeNodes);
  return bookmarks;
}

export async function getTopSites() {
  const topSites = await chrome.topSites.get();
  return topSites.map((site) => {
    return {
      label: `Top Sites: ${site.title}`,
      url: site.url,
    };
  });
}

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

export async function activateExtension(tab) {
  if (tab.id) {
    await chrome.tabs.sendMessage(tab.id, {
      toggleVisible: true,
      data: {
        store,
        bookmarks: await getBookmarks(),
        topSites: await getTopSites(),
        tabs: await chromeCommands.switchToTab.list(),
        // apps: await chromeCommands.apps.list(),  // Chromium bug, API does not return apps https://bugs.chromium.org/p/chromium/issues/detail?id=1263843
      },
    });
  }
}
