import { renderTemplateString } from "./labels";
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
      commands.push({
        type,
        labelText: config.label,
        config: config,
      });
    }
  });
  return commands;
}
