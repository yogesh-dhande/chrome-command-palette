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

export function openUrl(url, target) {
  window.open(url, target ? target : "_self");
}

export function triggerElement(command) {
  const type = command.config.trigger.type;
  const el = command.triggerElement;

  if (type === "click") {
    el.click();
  } else if (type === "simulatedClick") {
    setTimeout(() => simulateMouseClick(el), 200);
  } else if (type === "open") {
    openUrl(el.href, command.config.trigger.target);
  } else if (type === "focus") {
    setTimeout(() => el.focus(), 200);
  }
}

export function getIconNameForCommand(command) {
  if (command.type == "link") {
    return "LinkIcon";
  } else if ((command.type = "element")) {
    const type = command.config.trigger.type;
    if ((type === "click") | (type === "simulatedClick")) {
      return "CursorClickIcon";
    } else if (type === "open") {
      return "LinkIcon";
    } else if (type === "focus") {
      return "AnnotationIcon";
    }
  }
}
