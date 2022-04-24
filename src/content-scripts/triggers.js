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

export function trigger(type, el) {
  if (type === "click") {
    el.click();
    // simulateMouseClick(el);
  } else if (type === "open") {
    const url = el.href;
    if (isValidHttpUrl(url)) {
      window.open(url, el.target ? el.target : "_self");
    } else {
      el.click();
    }
  } else if (type === "focus") {
    el.focus();
  }
}

export function getIconNameForTriggerType(type) {
  if (type === "click") {
    return "CursorClickIcon";
  } else if (type === "open") {
    return "LinkIcon";
  } else if (type === "focus") {
    return "AnnotationIcon";
  }
}
