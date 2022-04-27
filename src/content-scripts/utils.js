export function isHidden(el) {
  const style = window.getComputedStyle(el);
  return style.display === "none";
}

function download(data, filename) {
  // TODO need to make commands flat so I can use Object.values here
  let csvContent =
    "data:text/csv;charset=utf-8," + data.map((e) => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}
