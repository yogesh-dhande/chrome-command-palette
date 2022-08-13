import { renderTemplateString } from "./labels";
import { validateUrl } from "./validation";

export function isHidden(el, elementConfig) {
  if (elementConfig.allowHidden) {
    return false;
  }
  return el.offsetParent === null;
}

export const categories = {
  ALL: "All",
  PAGE: "Page",
  TABS: "Tabs",
  BOOKMARKS: "Bookmarks",
};

export function getCommandFromScope(scopeElement, type, elementConfig) {
  let command;
  const labelElement = elementConfig.label?.selector
    ? scopeElement.querySelector(elementConfig.label.selector)
    : scopeElement;

  const label = renderTemplateString(
    elementConfig.label.template,
    labelElement
  );

  const triggerElement = elementConfig.trigger.selector
    ? scopeElement.querySelector(elementConfig.trigger.selector)
    : scopeElement;

  if (
    label &&
    label !== "#" &&
    triggerElement &&
    !isHidden(triggerElement, elementConfig)
  ) {
    if (elementConfig.trigger.type === "open") {
      const url = validateUrl(triggerElement.href);
      if (url) {
        command = parseLinkCommand(
          label,
          url,
          elementConfig.order,
          elementConfig.disabled,
          [categories.ALL, categories.PAGE],
          triggerElement
        );
        return command;
      } else {
        // does not have a valid url but there may be a click handler attached to the element
        // e.g. div with role=link
        elementConfig.trigger.type = "click";
      }
    }
    command = {
      type,
      key: triggerElement,
      label,
      categories: [categories.ALL, categories.PAGE],
      scopeElement,
      triggerElement,
      config: elementConfig,
    };
  }
  return command;
}

function parseLinkCommand(
  label,
  url,
  order,
  disabled,
  categories,
  triggerElement = null
) {
  return {
    type: "link",
    key: url,
    label,
    categories,
    config: {
      url,
      label,
      target: "_self",
      order,
      disabled,
    },
    triggerElement,
  };
}

export function parseDomForCommands(data) {
  const commandsMap = new Map();
  let command;
  data.commandTemplates.forEach((template, index) => {
    const type = template.type;
    const config = template[template.type];

    // higher order commands are shown first
    config.order = config.order || index + 1;

    if (type === "element") {
      // this command is to trigger an event on a DOM element
      document
        .querySelectorAll(config.scope.selector)
        .forEach((scopeElement) => {
          const elementConfig = JSON.parse(JSON.stringify(config));
          command = getCommandFromScope(scopeElement, type, elementConfig);
          if (command) commandsMap.set(command.key, command);
        });
    } else if (type == "link") {
      // this command is to open the specified url
      command = parseLinkCommand(
        config.label,
        validateUrl(config.url),
        config.order,
        config.disabled,
        [categories.ALL, categories.PAGE]
      );
      commandsMap.set(command.key, command);
    }
  });

  commandsMap.set("goBack", {
    type: "callback",
    label: "Go back",
    config: {},
    categories: [categories.ALL, categories.PAGE],
    callback: () => history.back(),
  });

  commandsMap.set("goForward", {
    type: "callback",
    label: "Go forward",
    config: {},
    categories: [categories.ALL, categories.PAGE],
    callback: () => history.forward(),
  });

  commandsMap.set("reload", {
    type: "callback",
    label: "Reload this page",
    config: {},
    categories: [categories.ALL, categories.PAGE],
    callback: () => location.reload(),
  });

  data.chromeCommands.forEach((chromeCommand) => {
    commandsMap.set(
      `${chromeCommand.label}-${chromeCommand.config.id}`,
      chromeCommand
    );
  });

  // Remove commands with duplicate labels + trigger type since
  // they can’t be distinguished in the command palette even if
  // they have different trigger elements. Keep only one of them.
  // The current implementation keeps the last one encountered.
  // commands already have unique trigger elements at this stage
  function getuniquenessTag(command) {
    let uniquenessTag = command.label + command.type;
    if (command.type === "element") {
      uniquenessTag += command.config.trigger.type;
    }
    return uniquenessTag;
  }

  const commandsByUniuqnessTag = new Map();
  Array.from(commandsMap.values()).forEach((command) => {
    const uniquenessTag = getuniquenessTag(command);
    commandsByUniuqnessTag[uniquenessTag] = command;
  });
  const commands = Array.from(commandsByUniuqnessTag.values())
    .filter((command) => !command.config?.disabled) // exclude disabled commands
    .sort((a, b) => b.config?.order - a.config?.order);

  return commands;
}
