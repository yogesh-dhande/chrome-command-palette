import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import { parseDomForCommands } from "./commands";
import { downloadCommands } from "./utils";

let downloaded = false;

const store = {
  commands: [],
};

const vm = createApp(Popup, {
  store,
}).mount(document.body.lastElementChild);

chrome.runtime.onMessage.addListener((message) => {
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = [];
      parseDomForCommands(store.commands);

      if (!downloaded) {
        downloaded = true;
        // downloadCommands(window.location.href);
      }
    }
  }
});
