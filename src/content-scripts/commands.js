import { renderTemplateString } from "./labels";
import { isHidden } from "./utils";

export function parseDomForCommands(commandTemplates, commands) {
  commandTemplates.forEach((template) => {
    if (template.scope?.selector) {
      document.querySelectorAll(template.scope.selector).forEach((scope) => {
        const labelElement = template.label.selector
          ? scope.querySelector(template.label.selector)
          : scope;

        const label = renderTemplateString(
          template.label.template,
          labelElement
        );

        const triggerElement = template.trigger.selector
          ? scope.querySelector(template.trigger.selector)
          : scope;

        if (
          label &&
          label !== "#" &&
          triggerElement &&
          !isHidden(triggerElement)
        ) {
          commands.push({
            scope,
            label,
            triggerElement,
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
