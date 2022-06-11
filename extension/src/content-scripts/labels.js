const paramsPattern = /[^{\}]+(?=})/g;

const cache = {};

export function renderTemplateString(templateString, el) {
  if (templateString === "input") {
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
  return templateString.substring(0, 80);
}

export function getLabelForInput(el) {
  let label = "";
  if (el.ariaLabel) {
    label = el.ariaLabel;
  } else if (el.id) {
    const label_el = document.querySelector(`[for="${el.id}"]`);
    if (label_el) {
      label = label_el.innerText;
    }
  } else {
    label = el.placeholder;
  }
  return label ? `${label} Input` : null;
}

export function getLabelForButton(el) {
  if (el.ariaLabel) {
    return el.ariaLabel;
  } else if (el.dataset.tooltip) {
    return el.dataset.tooltip;
  }
  return el.innerText;
}
