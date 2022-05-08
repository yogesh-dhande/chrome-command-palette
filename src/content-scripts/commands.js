import { renderTemplateString } from "./labels";
import { isValidHttpUrl } from "./validation";
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
  if (url.startsWith("/")) {
    url = `${window.location.origin}${url}`;
  }
  return {
    type: "link",
    labelText: label,
    config: {
      url,
      label,
      target: "_self",
    },
  };
}

export function parseDomForCommands(commands) {
  commandTemplates.forEach((template) => {
    // TODO need to return all commands
    const type = template.type;
    const config = template[template.type];

    if (type === "element") {
      // this command is to trigger an event on a DOM element
      document
        .querySelectorAll(config.scope.selector)
        .forEach((scopeElement) => {
          const labelElement = config.label.selector
            ? scopeElement.querySelector(config.label.selector)
            : scopeElement;

          const labelText = renderTemplateString(
            config.label.template,
            labelElement
          );

          const triggerElement = config.trigger.selector
            ? scopeElement.querySelector(config.trigger.selector)
            : scopeElement;

          if (
            labelText &&
            labelText !== "#" &&
            triggerElement &&
            !isHidden(triggerElement)
          ) {
            if (config.trigger.type === "open") {
              const url = triggerElement.href;
              if (isValidHttpUrl(url)) {
                commands.push(parseLinkCommand(labelText, url));
                return;
              } else {
                // does not have a valid url but there may be a click handler attached to the element
                config.trigger.type = "click";
              }
            }
            commands.push({
              type,
              labelText,
              scopeElement,
              triggerElement,
              config: config,
            });
          }
        });
    } else if (type == "link") {
      // this command is to open the specified url
      commands.push(parseLinkCommand(config.label, config.url));
    }
  });
  return commands;
}
