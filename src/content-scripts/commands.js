import { renderTemplateString } from "./labels";
import packs from "./packs.json";

function isHidden(el) {
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
    if (template.scope?.selector) {
      document
        .querySelectorAll(template.scope.selector)
        .forEach((scopeElement) => {
          const labelElement = template.label.selector
            ? scopeElement.querySelector(template.label.selector)
            : scopeElement;

          const labelText = renderTemplateString(
            template.label.template,
            labelElement
          );

          const triggerElement = template.trigger.selector
            ? scopeElement.querySelector(template.trigger.selector)
            : scopeElement;

          if (
            labelText &&
            labelText !== "#" &&
            triggerElement &&
            !isHidden(triggerElement)
          ) {
            commands.push({
              scopeElement,
              labelText,
              triggerElement,
              scope: template.scope,
              label: template.label,
              trigger: template.trigger,
            });
          }
        });
    } else if (template.trigger.url) {
      // this command is to open the specified url
      commands.push({
        label: template.label.template,
        trigger: template.trigger,
      });
    }
  });
  return commands;
}
