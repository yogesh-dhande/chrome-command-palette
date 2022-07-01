import { getCurrentTab } from "./utils";
import { categories } from "./content-scripts/commands";

export const chromeCommands = {
  switchToTab: {
    async list() {
      const tabList = await chrome.tabs.query({});
      return tabList.map((tab) => {
        return {
          type: "chrome",
          label: `Tabs: ${tab.title}`,
          config: {
            name: "switchToTab",
            id: tab.id,
            windowId: tab.windowId,
            url: tab.url,
            favIconUrl: tab.favIconUrl,
          },
          categories: [categories.ALL, categories.TABS],
          options: [
            {
              type: "chrome",

              label: "Close Tab",
              config: {
                name: "closeTab",
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

          label: `Tabs: Split tab to right`,
          config: {
            name: "splitTab",
            side: "right",
          },
          categories: [categories.ALL, categories.TABS],
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
  addToBookmarks: {
    async list() {
      return [
        {
          type: "chrome",

          label: "Bookmark this page",
          config: {
            name: "addToBookmarks",
            form: {
              title: {
                type: "text",
                default: (await getCurrentTab()).title,
              },
            },
          },
          categories: [categories.ALL, categories.BOOKMARKS],
        },
      ];
    },
    async execute(config) {
      await chrome.bookmarks.create({
        title: config.form.title,
        url: (await getCurrentTab()).url,
      });
    },
  },
  openBookmark: {
    async list() {
      const bookmarks = [];

      function dumpNode(node) {
        if (node.url) {
          bookmarks.push({
            type: "chrome",

            label: `Bookmarks: ${node.title}`,
            config: {
              name: "openBookmark",
              url: node.url,
            },
            categories: [categories.ALL, categories.BOOKMARKS],
            options: [
              {
                type: "chrome",
                label: "New tab",
                config: {
                  name: "createTab",
                  url: node.url,
                },
              },
              {
                type: "chrome",
                label: "Remove",
                config: {
                  name: "removeBookmark",
                  id: node.id,
                },
              },
            ],
          });
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
    },
    async execute(config) {
      await chrome.tabs.update({ url: config.url });
    },
  },
  createTab: {
    async execute(config) {
      await chrome.tabs.create({ url: config.url });
    },
  },
  removeBookmark: {
    async execute(config) {
      await chrome.bookmarks.remove(config.id);
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
