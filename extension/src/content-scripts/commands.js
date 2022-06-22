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
  TOP_SITES: "Frequently Visited",
};

export function getCommandFromScope(scopeElement, type, elementConfig) {
  let command;
  const labelElement = elementConfig.label.selector
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
    label: "Go Back",
    categories: [categories.ALL, categories.PAGE],
    callback: () => history.back(),
  });

  commandsMap.set("goForward", {
    type: "callback",
    label: "Go Forward",
    categories: [categories.ALL, categories.PAGE],
    callback: () => history.forward(),
  });

  data.tabs.forEach((tab) => {
    let command = {
      key: tab.config.id,
      categories: [categories.ALL, categories.TABS],
      ...tab,
    };
    commandsMap.set(command.key, command);
  });

  data.bookmarks.forEach((bookmark) => {
    command = parseLinkCommand(bookmark.label, bookmark.url, -1, false, [
      categories.ALL,
      categories.BOOKMARKS,
    ]);
    commandsMap.set(command.key, command);
  });

  data.topSites.forEach((site) => {
    command = parseLinkCommand(site.label, site.url, -1, false, [
      categories.ALL,
      categories.TOP_SITES,
    ]);
    commandsMap.set(command.key, command);
  });

  // TODO: not every command has a config anymore
  return Array.from(commandsMap.values())
    .filter((command) => !command.config?.disabled)
    .sort((a, b) => b.config?.order - a.config?.order);
}
