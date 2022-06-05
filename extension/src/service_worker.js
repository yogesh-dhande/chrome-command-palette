import { chromeCommands } from "./packs/chrome";
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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    case "execute_chrome_command":
      await chromeCommands[request.command.name].execute(
        request.command.config
      );
      return true;
    case "search":
      await chrome.search.query({
        text: request.query,
        disposition: "NEW_TAB",
      });
      return true;
    case "RECORD_TAB":
      const tab = sender.tab;
      recordedTabConfig = {
        id: tab.id,
        windowId: tab.windowId,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      };
      return true;
    default:
      break;
  }
});
