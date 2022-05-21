import { parseDomForCommands } from "./commands";

export function downloadCommands(filename) {
  const commands = parseDomForCommands([]);
  // TODO need to make commands flat so I can use Object.values here
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent +=
    "scopeSelector,labelSelector,labelTemplate,label,triggerSelector,triggerType,triggerUrl,triggerElement\n";

  csvContent += commands
    .map(
      (command) =>
        `${command.scope?.selector},${command.label.selector},${command.label.template},${command.label},${command.trigger.selector},${command.trigger.type},${command.trigger.url},${command.triggerElement?.outerHTML}`
    )
    .join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}
