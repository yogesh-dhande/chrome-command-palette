// This trigger is a hack for Gmail buttons that don't have a click event attached
function simulateMouseClick(triggerElement) {
  function triggerMouseEvent(targetNode, eventType) {
    var clickEvent = new MouseEvent(eventType, {
      view: window,
      bubbles: false,
      cancelable: false,
    });
    return targetNode.dispatchEvent(clickEvent);
  }

  function triggerClick(el) {
    ["mouseover", "mousedown", "mouseup", "mouseout"].forEach(function(
      eventType
    ) {
      triggerMouseEvent(el, eventType);
    });
  }

  // The following is a hack for Gmail toolbar buttons
  triggerElement.focus();
  triggerClick(triggerElement);
  // // compute trigger element again
  // const elementConfig = command.config;
  // const scopeElement = command.scopeElement;
  // triggerElement = elementConfig.trigger.selector
  //   ? scopeElement.querySelector(elementConfig.trigger.selector)
  //   : scopeElement;

  // // retry is triggerElement still found
  // if (triggerElement) {
  //   triggerClick(triggerElement);
  // }
}

export function openUrl(command) {
  if (command.triggerElement) {
    command.triggerElement.click();
  } else {
    window.open(
      command.config.url,
      command.config.target ? command.config.target : "_self"
    );
  }
}

export function triggerElementCommand(command) {
  const type = command.config.trigger.type;
  const el = command.triggerElement;

  if (type === "click") {
    el.click();
    el.scrollIntoView({ block: "center", inline: "center" });
  } else if (type === "simulatedClick") {
    setTimeout(() => {
      simulateMouseClick(el);
      el.scrollIntoView({ block: "center", inline: "center" });
    }, 200);
  } else if (type === "dblclick") {
    var doubleClickEvent = new Event("dblclick");
    el.dispatchEvent(doubleClickEvent);
  } else if (type === "focus") {
    setTimeout(() => {
      el.focus();
      el.scrollIntoView({ block: "center", inline: "center" });
    }, 200);
  }
}

export async function triggerCommand(command) {
  if (command.type === "element") {
    triggerElementCommand(command);
  } else if (command.type === "link") {
    openUrl(command);
  } else if (command.type === "chrome") {
    await chrome.runtime.sendMessage({
      type: "execute_chrome_command",
      command,
    });
  } else if (command.type === "callback") {
    command.callback();
  }
  if (command.config.next) {
    chrome.runtime.sendMessage({
      type: "next_command",
      command: command.config.next,
    });
  }
}
