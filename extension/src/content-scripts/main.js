import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import { parseDomForCommands } from "./commands";
import { downloadCommands } from "./utils";
import { store } from "./store";

let downloaded = false;

const container = document.createElement("div");
document.body.appendChild(container);
const vm = createApp(Popup, {}).mount(container);

chrome.runtime.onMessage.addListener((message) => {
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
});
