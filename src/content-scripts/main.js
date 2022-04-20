import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";

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

function interpretStringTemplate(template, el) {
  return template;
}

const commandGenerators = [
  {
    scopeSelector: "a",
    labelElementSelector: null,
    labelTemplate: null,
    labelTemplateFunction: (el) => el.innerText,
    triggerElementSelector: null,
    triggerType: "open",
  },
  {
    scopeSelector: "button",
    labelElementSelector: null,
    labelTemplate: null,
    labelTemplateFunction: (el) => el.innerText,
    triggerElementSelector: null,
    triggerType: "click",
  },
  {
    scopeSelector: "input",
    labelElementSelector: null,
    labelTemplate: null,
    labelTemplateFunction: (el) => el.ariaLabel,
    triggerElementSelector: null,
    triggerType: "focus",
  },
];

function parseDom() {
  const commands = [];

  commandGenerators.forEach((generator) => {
    document.querySelectorAll(generator.scopeSelector).forEach((scope) => {
      const labelElement = generator.labelElementSelector
        ? scope.querySelector(generator.labelElementSelector)
        : scope;

      const label = generator.labelTemplateFunction
        ? generator.labelTemplateFunction(labelElement)
        : generator.labelTemplate
        ? interpretStringTemplate(generator.labelTemplate, labelElement)
        : null;

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
