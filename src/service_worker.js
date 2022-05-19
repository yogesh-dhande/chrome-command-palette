async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

async function activateExtension(tab) {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      toggleVisible: true,
      data: {
        bookmarks: await getBookmarks(),
        topSites: await getTopSites(),
        tabs: await chromeCommands.switchToTab.list(),
        // apps: await chromeCommands.apps.list(),  // Chromium bug, API does not return apps https://bugs.chromium.org/p/chromium/issues/detail?id=1263843
      },
    });
  }
}

chrome.action.onClicked.addListener(activateExtension);

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "activate_extension") {
    const tab = await getCurrentTab();
    await activateExtension(tab);
    return true;
  }
  return true;
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    case "execute_chrome_command":
      await chromeCommands[request.command.name].execute(
        request.command.config
      );
      sendResponse(true);
    case "search":
      await chrome.search.query({
        text: request.query,
        disposition: "NEW_TAB",
      });
      sendResponse(true);
    default:
      break;
  }
});

async function getBookmarks() {
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

async function getTopSites() {
  const topSites = await chrome.topSites.get();
  return topSites.map((site) => {
    return {
      label: `Top Sites: ${site.title}`,
      url: site.url,
    };
  });
}

const chromeCommands = {
  switchToTab: {
    async list() {
      const tabList = await chrome.tabs.query({});
      return tabList.map((tab) => {
        return {
          type: "chrome",
          name: "switchToTab",
          label: `Tabs: ${tab.title}`,
          config: {
            id: tab.id,
            windowId: tab.windowId,
            url: tab.url,
            favIconUrl: tab.favIconUrl,
          },
          options: [
            {
              type: "chrome",
              name: "closeTab",
              label: "Close Tab",
              config: {
                id: tab.id,
              },
            },
          ],
        };
      });
    },
    async execute(config) {
      await chrome.windows.update(config.windowId, {
        focused: true,
      });
      await chrome.tabs.update(config.id, {
        active: true,
        highlighted: true,
      });
    },
  },
  closeTab: {
    async execute(config) {
      await chrome.tabs.remove([config.id]);
    },
  },
  apps: {
    async list() {
      const appList = await chrome.management.getAll();
      return appList
        .filter((app) => app.appLaunchUrl) // only keep apps as extensions cannot be launched
        .map((app) => {
          return {
            type: "chrome",
            name: "apps",
            label: `App: ${app.name}`,
            config: {
              id: app.id,
            },
          };
        });
    },
    async execute(config) {
      await chrome.management.launchApp(config.id);
    },
  },
};

const chromeLinks = [
  {
    label: "Chrome: Settings",
    url: "Chrome: Settings",
  },
  {
    label: "Chrome: Privacy and Security",
    url: "chrome://settings/privacy",
  },
  {
    label: "Chrome: Clear Browser Data",
    url: "chrome://settings/clearBrowserData",
  },
  {
    label: "Chrome: Extensions",
    url: "chrome://extensions/",
  },
  {
    label: "Chrome Site Settings",
    url: "chrome://settings/content",
  },
  {
    label: "Chrome: Downloads",
    url: "chrome://downloads",
  },
  {
    label: "Chrome: Search Extensions",
    url: "https://chrome.google.com/webstore/category/extensions",
  },
  {
    label: "Chrome: Search Themes",
    url: "Search themes",
  },
  {
    label: "Chrome: Cookie Settings",
    url: "chrome://settings/cookies",
  },
  {
    label: "Chrome: Tabs from other devices",
    url: "chrome://history/syncedTabs",
  },
];
