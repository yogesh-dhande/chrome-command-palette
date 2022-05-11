import { renderTemplateString } from "./labels";
import { validateUrl } from "./validation";
import packs from "./packs.json";

export function isHidden(el) {
  const style = window.getComputedStyle(el);
  return style.display === "none";
}

const commandTemplates = [];

Object.keys(packs).forEach((urlpattern) => {
  if ((urlpattern === "*") | window.location.href.includes(urlpattern)) {
    commandTemplates.push(...packs[urlpattern]);
  }
});

function parseLinkCommand(label, url) {
  return {
    type: "link",
    key: url,
    labelText: label,
    config: {
      url,
      label,
      target: "_self",
    },
  };
}

export function parseDomForCommands() {
  const commandsMap = new Map();

  commandTemplates.forEach((template) => {
    const type = template.type;
    const config = template[template.type];
    console.log(config);

    let command;

    if (type === "element") {
      // this command is to trigger an event on a DOM element
      document
        .querySelectorAll(config.scope.selector)
        .forEach((scopeElement) => {
          const elementConfig = JSON.parse(JSON.stringify(config));
          const labelElement = elementConfig.label.selector
            ? scopeElement.querySelector(elementConfig.label.selector)
            : scopeElement;

          const labelText = renderTemplateString(
            elementConfig.label.template,
            labelElement
          );

          const triggerElement = elementConfig.trigger.selector
            ? scopeElement.querySelector(elementConfig.trigger.selector)
            : scopeElement;

          if (
            labelText &&
            labelText !== "#" &&
            triggerElement &&
            !isHidden(triggerElement)
          ) {
            if (elementConfig.trigger.type === "open") {
              const url = validateUrl(triggerElement.href);
              if (url) {
                command = parseLinkCommand(labelText, url);
                commandsMap.set(command.key, command);
                return;
              } else {
                // does not have a valid url but there may be a click handler attached to the element
                elementConfig.trigger.type = "click";
              }
            }
            command = {
              type,
              key: triggerElement,
              labelText,
              scopeElement,
              triggerElement,
              config: config,
            };
            commandsMap.set(command.key, command);
          }
        });
    } else if (type == "link") {
      // this command is to open the specified url
      command = parseLinkCommand(config.label, validateUrl(config.url));
      commandsMap.set(command.key, command);
    }
  });
  console.log(Array.from(commandsMap.values()));
  return Array.from(commandsMap.values());
}
