import { parseDomForCommands } from "./commands";

export function downloadCommands(commands) {
  const filename = window.location.href
    .replaceAll("/", "-")
    .replaceAll(":", "-");

  //Convert JSON Array to string.
  let json = JSON.stringify(commands);

  //Convert JSON string to BLOB.
  json = [json];
  const blob1 = new Blob(json, {
    type: "text/plain;charset=utf-8",
  });

  const url = window.URL || window.webkitURL;
  const link = url.createObjectURL(blob1);
  const a = document.createElement("a");
  a.download = filename;
  a.href = link;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
