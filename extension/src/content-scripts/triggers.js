function simulateMouseClick(targetNode) {
  function triggerMouseEvent(targetNode, eventType) {
    var clickEvent = new MouseEvent(eventType, {
      view: window,
      bubbles: false,
      cancelable: false,
    });
    return targetNode.dispatchEvent(clickEvent);
  }

  ["mouseover", "mousedown", "mouseup"].forEach(function(eventType) {
    const r = triggerMouseEvent(targetNode, eventType);
  });
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
  } else if (type === "focus") {
    setTimeout(() => {
      el.focus();
      el.scrollIntoView({ block: "center", inline: "center" });
    }, 200);
  }
}

export function getIconNameForCommand(command) {
  if (command.type === "link") {
    return "LinkIcon";
  } else if (command.type === "element") {
    const type = command.config.trigger.type;
    if ((type === "click") | (type === "simulatedClick")) {
      return "CursorClickIcon";
    } else if (type === "open") {
      return "LinkIcon";
    } else if (type === "focus") {
      return "AnnotationIcon";
    }
  } else {
    return "GlobeAltIcon";
  }
}

export async function triggerCommand(command) {
  console.log(command);
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
  if (command.next) {
    chrome.runtime.sendMessage({ type: "next_command", command: command.next });
  }
}
