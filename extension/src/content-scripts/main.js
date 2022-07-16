import { createApp } from "vue";
import Popup from "./Popup.vue";
import { getCommandFromScope, parseDomForCommands } from "./commands";
import { downloadCommands } from "./utils";
import { store } from "./store";
import { triggerCommand } from "./triggers";

let downloaded = false;

let vm;
const ROOT_ELEMENT_ID = "single-dispatch-root";

if (!document.getElementById(ROOT_ELEMENT_ID)) {
  const container = document.createElement("div");
  container.id = ROOT_ELEMENT_ID;
  document.body.appendChild(container);
  vm = createApp(Popup, {}).mount(container);
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = parseDomForCommands(message.data);
      store.currentUser = message.data.store.currentUser;
      store.isLoggedIn = message.data.store.isLoggedIn;
      if (!downloaded) {
        downloaded = true;
        // downloadCommands(window.location.href);
      }
    }
  } else if (message.type === "run_command") {
    // Assume it is an element command
    let command = message.command;
    let interval = command.interval || 200;
    let timeout = command.timeout || 10000;
    let elapsed = 0;
    const type = command.type;
    const config = command[type];

    const waitUntilSelector = config.trigger.selector;
    const intervalId = setInterval(async function() {
      if (document.querySelector(waitUntilSelector)) {
        command = getCommandFromScope(document.body, type, config);
        triggerCommand(command);
        clearInterval(intervalId);
      } else if (elapsed > timeout) {
        clearInterval(intervalId);
      }
      elapsed += interval;
    }, interval);
  }
  sendResponse(null);
});
