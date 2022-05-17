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
      bookmarks: await getBookmarks(),
      topSites: await getTopSites(),
      chromeLinks,
      tabs: await chromeCommands.tabs.list(),
    });
  }
}

chrome.action.onClicked.addListener(activateExtension);

chrome.commands.onCommand.addListener(function(command) {
  if (command === "activate_extension") {
    getCurrentTab().then(activateExtension);
    return true;
  }
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "execute_chrome_command":
      chromeCommands[request.command.name].execute(request.command.config);
      return true;
    default:
      break;
  }
});

function search(query) {
  chrome.search.query({
    text: query,
    disposition: "NEW_TAB",
  });
}

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
  tabs: {
    async list() {
      const tabList = await chrome.tabs.query({});
      return tabList.map((tab) => {
        return {
          type: "chrome",
          name: "tabs",
          labelText: `Tabs: ${tab.title}`,
          config: {
            id: tab.id,
            windowId: tab.windowId,
            url: tab.url,
            favIconUrl: tab.favIconUrl,
          },
        };
      });
    },
    execute(config) {
      chrome.windows.update(config.windowId, {
        focused: true,
      });
      chrome.tabs.update(config.id, {
        active: true,
        highlighted: true,
      });
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
