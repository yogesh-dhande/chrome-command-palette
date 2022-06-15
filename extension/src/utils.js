import { store } from "./firebaseConfig";
import { chromeCommands } from "./chrome";

async function updatePacks() {
  try {
    const url = `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL}/getPacks`;
    const res = await fetch(url, { method: "GET" });
    const packs = await res.json();
    chrome.storage.sync.set({ singleDispatchPacks: packs });
    console.log("Packs updated");
  } catch (error) {
    console.log(error);
  }
}

updatePacks();

const packsUpdateInterval = setInterval(async () => {
  try {
    await updatePacks();
  } catch (error) {
    console.log(error);
  }
}, 1000 * 60 * import.meta.env.VITE_PACKS_UPDATE_INTERVAL_MINUTES);

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
      label: `Frequently Visited: ${site.title}`,
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
    chrome.storage.sync.get(["singleDispatchPacks"], async (obj) => {
      const packs = obj.singleDispatchPacks;
      const commandTemplates = [];
      Object.keys(packs).forEach((urlpattern) => {
        if ((urlpattern === "*") | tab.url.includes(urlpattern)) {
          commandTemplates.push(...packs[urlpattern]);
        }
      });

      await chrome.tabs.sendMessage(tab.id, {
        toggleVisible: true,
        data: {
          store,
          commandTemplates,
          bookmarks: await getBookmarks(),
          topSites: await getTopSites(),
          tabs: await chromeCommands.switchToTab.list(),
        },
      });
    });
  }
}
