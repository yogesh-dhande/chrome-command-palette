import { createApp } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import packs from "./packs.json";
import { renderTemplateString } from "./labels";

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

console.log(commandTemplates);

function parseDom() {
  const commands = [];

  commandTemplates.forEach((template) => {
    document.querySelectorAll(template.scope.selector).forEach((scope) => {
      const labelElement = template.label.selector
        ? scope.querySelector(template.label.selector)
        : scope;

      const label = renderTemplateString(template.label.template, labelElement);

      if (label && label !== "#") {
        commands.push({
          scope,
          label,
          trigger: template.trigger,
        });
      }
    });
  });
  console.log(commands);
  return commands;
}

chrome.runtime.onMessage.addListener((message) => {
  // document
  //   .querySelector('[data-tooltip="Older"]')
  //   .dispatchEvent(new MouseEvent("mousedown"));
  // document
  //   .querySelector('[data-tooltip="Older"]')
  //   .dispatchEvent(new MouseEvent("mouseup"));

  if (message.toggleVisible) {
    vm.visible = !vm.visible;
    if (vm.visible) {
      store.commands = parseDom();
    }
  }
});
