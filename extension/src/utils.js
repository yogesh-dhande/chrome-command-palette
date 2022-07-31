import { store } from "./firebaseConfig";
import { chromeCommands } from "./chrome";

async function updatePacks() {
  try {
    const url = `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL}/getPacks`;
    const res = await fetch(url, { method: "GET" });
    const packs = await res.json();
    chrome.storage.sync.set({ singleDispatchPacks: packs });
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
          chromeCommands: [].concat.apply(
            [],
            await Promise.all([
              chromeCommands.addToBookmarks.list(),
              chromeCommands.openBookmark.list(),
              chromeCommands.switchToTab.list(),
              chromeCommands.splitTab.list(),
            ])
          ),
        },
      });
    });
  }
}
