import { renderTemplateString } from "./labels";
import { validateUrl } from "./validation";
import packs from "./packs.json";

export function isHidden(el) {
  const style = window.getComputedStyle(el);
  return style.display === "none";
}

export const categories = {
  ALL: "All",
  PAGE: "Page",
  BOOKMARKS: "Bookmarks",
  TABS: "Tabs",
  TOP_SITES: "Top Sites",
};

const commandTemplates = [];

Object.keys(packs).forEach((urlpattern) => {
  if ((urlpattern === "*") | window.location.href.includes(urlpattern)) {
    commandTemplates.push(...packs[urlpattern]);
  }
});

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

  if (label && label !== "#" && triggerElement && !isHidden(triggerElement)) {
    if (elementConfig.trigger.type === "open") {
      const url = validateUrl(triggerElement.href);
      if (url) {
        command = parseLinkCommand(label, url, [
          categories.ALL,
          categories.PAGE,
        ]);
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

function parseLinkCommand(label, url, categories) {
  return {
    type: "link",
    key: url,
    label,
    categories,
    config: {
      url,
      label,
      target: "_self",
    },
  };
}

export function parseDomForCommands(data) {
  const commandsMap = new Map();
  let command;

  commandTemplates.forEach((template) => {
    const type = template.type;
    const config = template[template.type];

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
      command = parseLinkCommand(config.label, validateUrl(config.url), [
        categories.ALL,
        categories.PAGE,
      ]);
      commandsMap.set(command.key, command);
    }
  });

  data.bookmarks.forEach((bookmark) => {
    command = parseLinkCommand(bookmark.label, bookmark.url, [
      categories.ALL,
      categories.BOOKMARKS,
    ]);
    commandsMap.set(command.key, command);
  });

  data.topSites.forEach((site) => {
    command = parseLinkCommand(site.label, site.url, [
      categories.ALL,
      categories.TOP_SITES,
    ]);
    commandsMap.set(command.key, command);
  });

  data.tabs.forEach((tab) => {
    let command = {
      key: tab.config.id,
      categories: [categories.ALL, categories.TABS],
      ...tab,
    };
    commandsMap.set(command.key, command);
  });

  return Array.from(commandsMap.values());
}
