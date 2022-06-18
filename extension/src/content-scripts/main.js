import { createApp } from "vue";
import Popup from "./Popup.vue";
import { parseDomForCommands } from "./commands";
import { downloadCommands } from "./utils";
import { store } from "./store";

let downloaded = false;

let vm;
const ROOT_ELEMENT_ID = "single-dispatch-root";

if (!document.getElementById(ROOT_ELEMENT_ID)) {
  const container = document.createElement("div");
  container.id = ROOT_ELEMENT_ID;
  document.body.appendChild(container);
  vm = createApp(Popup, {}).mount(container);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
  }
  sendResponse(null);
});
