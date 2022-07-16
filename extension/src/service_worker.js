import { chromeCommands } from "./chrome";
import { getCurrentTab, activateExtension } from "./utils";
import { login } from "./firebaseConfig";

// Used to store info on the tab to login page so it can be focused after login
let recordedTabConfig = null;

chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    await login(message.data);
    if (recordedTabConfig) {
      await chromeCommands.switchToTab.execute(recordedTabConfig);
      const tab = await getCurrentTab();
      await activateExtension(tab);
      recordedTabConfig = null;
    }
    return true;
  }
);

chrome.action.onClicked.addListener(activateExtension);

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "activate_extension") {
    const tab = await getCurrentTab();
    await activateExtension(tab);
    return true;
  }
  return true;
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "https://blog.singledispatch.com/welcome",
    });
  }
});

chrome.runtime.setUninstallURL("https://blog.singledispatch.com/uninstalled");

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  let tab = sender.tab;
  switch (message.type) {
    case "execute_chrome_command":
      await chromeCommands[message.command.config.name].execute(
        message.command.config
      );
      break;
    case "next_command":
      tab = await getCurrentTab();
      await chrome.tabs.sendMessage(tab.id, {
        type: "run_command",
        command: message.command,
      });
      break;
    case "search":
      chrome.search.query({
        text: message.query,
        disposition: "NEW_TAB",
      });
      break;
    case "RECORD_TAB":
      recordedTabConfig = {
        id: tab.id,
        windowId: tab.windowId,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      };
      break;
    default:
      break;
  }
  sendResponse(null);
});
