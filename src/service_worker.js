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
  switch (command) {
    case "activate_extension":
      chrome.commands.getAll((commands) => console.log(commands));
      getCurrentTab().then(activateExtension);
      return true;
    default:
      console.log(`Command ${command} not found`);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "POPUP_INIT":
      // TODO remove if unused
      getCurrentTab().then(sendResponse);
      return true;
    default:
      break;
  }
});
