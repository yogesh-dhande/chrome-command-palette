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
