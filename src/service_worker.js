async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function activateExtension(tab) {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  }
}

chrome.action.onClicked.addListener(activateExtension);

chrome.commands.onCommand.addListener(function(command) {
  if (command === "activate_extension") {
    chrome.commands.getAll((commands) => console.log(commands));
    getCurrentTab().then(activateExtension);
  }
  return true;
});
