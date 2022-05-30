import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import { parseDomForCommands } from "./commands";
import { downloadCommands } from "./utils";
import { store } from "./store";

let downloaded = false;

const vm = createApp(Popup, {}).mount(document.body.lastElementChild);

chrome.runtime.onMessage.addListener((message) => {
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = parseDomForCommands(message.data);
      store.currentUser = message.data.store.currentUser;
      store.isLoggedIn = message.data.store.isLoggedIn;
      console.log(message.data.store);
      if (!downloaded) {
        downloaded = true;
        // downloadCommands(window.location.href);
      }
    }
  }
});
