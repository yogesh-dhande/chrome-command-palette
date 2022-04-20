import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import packs from "./packs.json";
import { renderTemplateString } from "./labels";

const MOUNT_EL_ID = "as-awesome-extension";

let mountEl = document.getElementById(MOUNT_EL_ID);
if (mountEl) {
  mountEl.innerHTML = "";
}
mountEl = document.createElement("div");
mountEl.setAttribute("id", MOUNT_EL_ID);
document.body.appendChild(mountEl);

const store = {
  commands: [],
};

const vm = createApp(Popup, {
  store,
}).mount(mountEl);

const commandTemplates = [];

Object.keys(packs).forEach((urlpattern) => {
  if ((urlpattern === "*") | window.location.href.includes(urlpattern)) {
    commandTemplates.push(...packs[urlpattern]);
  }
});

console.log(commandTemplates);

function parseDom() {
  const commands = [];

  commandTemplates.forEach((generator) => {
    document.querySelectorAll(generator.scopeSelector).forEach((scope) => {
      const labelElement = generator.labelElementSelector
        ? scope.querySelector(generator.labelElementSelector)
        : scope;

      const label = renderTemplateString(generator.labelTemplate, labelElement);

      if (label && label !== "#") {
        commands.push({
          scope,
          label,
          triggerElementSelector: null,
          triggerType: generator.triggerType,
        });
      }
    });
  });

  return commands;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = parseDom();
      console.log(store.commands);
    }
  }
});
