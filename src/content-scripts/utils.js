export function isHidden(el) {
  console.log(el);
  const style = window.getComputedStyle(el);
  return style.display === "none";
}

function download() {}
