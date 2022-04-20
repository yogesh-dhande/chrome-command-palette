const paramsPattern = /[^{\}]+(?=})/g;

export function renderTemplateString(templateString, el) {
  const params = templateString.match(paramsPattern);
  params.forEach((param) => {
    console.log(el[param]);
    templateString = templateString.replace(`{${param}}`, el[param]);
  });
  return templateString;
}
