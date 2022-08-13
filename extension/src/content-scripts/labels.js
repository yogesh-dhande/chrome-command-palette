const paramsPattern = /[^{\}]+(?=})/g;

const cache = {};

export function renderTemplateString(templateString, el) {
  if (!el) {
    return;
  } else if (templateString === "input") {
    return getLabelForInput(el);
  } else if (templateString === "button") {
    return getLabelForButton(el);
  } else {
    if (!cache[templateString]) {
      const params = templateString.match(paramsPattern);
      cache[templateString] = params;
    }
    if (cache[templateString]) {
      cache[templateString].forEach((param) => {
        templateString = templateString.replace(`{${param}}`, el[param]);
      });
    }
  }
  return templateString.substring(0, 120);
}

export function getLabelForInput(el) {
  let label = "";
  if (el.ariaLabel) {
    label = el.ariaLabel;
  } else if (el.title) {
    label = el.title;
  } else if (el.id) {
    const label_el = document.querySelector(`[for="${el.id}"]`);
    if (label_el) {
      label = label_el.innerText;
    }
  } else if (el.getAttribute("aria-labelledby")) {
    const label_el = document.getElementById(
      el.getAttribute("aria-labelledby")
    );
    if (label_el) {
      label = label_el.innerText;
    }
  } else {
    label = el.placeholder;
  }
  return label ? `${label} Input` : null;
}

export function getLabelForButton(el) {
  if (el.dataset.tooltip) {
    return el.dataset.tooltip;
  } else if (el.title) {
    return el.title;
  } else if (el.ariaLabel) {
    return el.ariaLabel;
  } else if (el.getAttribute("aria-labelledby")) {
    const label_el = document.getElementById(
      el.getAttribute("aria-labelledby")
    );
    if (label_el) {
      return label_el.innerText;
    }
  }
  return el.innerText;
}
