import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import packs from "./packs.json";
import { parseDomForCommands } from "./commands";

const store = {
  commands: [],
};

const vm = createApp(Popup, {
  store,
}).mount(document.body.lastElementChild);

const commandTemplates = [];

Object.keys(packs).forEach((urlpattern) => {
  if ((urlpattern === "*") | window.location.href.includes(urlpattern)) {
    commandTemplates.push(...packs[urlpattern]);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = [];
      parseDomForCommands(commandTemplates, store.commands);
    }
  }
});
