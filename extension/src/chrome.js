import { getCurrentTab } from "./utils";

export const chromeCommands = {
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
            order: 0,
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
      await chrome.tabs.remove(config.id);
    },
  },
  splitTab: {
    async list() {
      return [
        {
          type: "chrome",
          name: "splitTab",
          label: `Tabs: Split tab to right`,
          config: {
            side: "right",
          },
        },
      ];
    },
    async execute(config) {
      const window = await chrome.windows.getCurrent();
      const width = (window.width / 2) | 0; // window height needs to be an integer
      // make window half width
      chrome.windows.update(window.id, {
        left: window.left,
        top: window.top,
        width,
        height: window.height,
      });
      // create a new window and move the current tab to it
      await chrome.windows.create({
        focused: false,
        left: window.left + width,
        top: window.top,
        width,
        height: window.height,
        tabId: (await getCurrentTab()).id,
      });
    },
  },
};

export const chromeLinks = [
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
