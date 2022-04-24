import { isValidHttpUrl } from "./validation";

function simulateMouseClick(targetNode) {
  function triggerMouseEvent(targetNode, eventType) {
    var clickEvent = new MouseEvent(eventType, {
      view: window,
      bubbles: false,
      cancelable: false,
    });
    return targetNode.dispatchEvent(clickEvent);
  }

  ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
    const r = triggerMouseEvent(targetNode, eventType);
    console.log(eventType, r);
  });
}

export function openUrl(url, target) {
  window.open(url, target ? target : "_self");
}

export function trigger(type, el) {
  if (type === "click") {
    el.click();
    // simulateMouseClick(el);
  } else if (type === "open") {
    const url = el.href;
    if (isValidHttpUrl(url)) {
      openUrl(url, el.target);
    } else {
      el.click();
    }
  } else if (type === "focus") {
    el.focus();
  }
}

export function getIconNameForTrigger(trigger) {
  const type = trigger.type;
  if (type === "click") {
    return "CursorClickIcon";
  } else if ((type === "open") | (trigger.url !== null)) {
    return "LinkIcon";
  } else if (type === "focus") {
    return "AnnotationIcon";
  }
}
