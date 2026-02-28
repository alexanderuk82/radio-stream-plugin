var FULL_WIDTH = 320;
var FULL_HEIGHT = 640;

figma.showUI(__html__, {
  width: FULL_WIDTH,
  height: FULL_HEIGHT,
  title: "Pulse Radio",
  themeColors: false,
});

function restoreState() {
  figma.clientStorage.getAsync("pulse-radio-state").then(function (state) {
    if (state) {
      figma.ui.postMessage({ type: "restored-state", state: state });
      if (state.isMinimized) {
        figma.ui.resize(300, 60);
      }
    }
  }).catch(function (_e) {
    // No saved state
  });
}

function restoreFavorites() {
  figma.clientStorage.getAsync("pulse-radio-favorites").then(function (favs) {
    if (favs && Array.isArray(favs)) {
      figma.ui.postMessage({ type: "restored-favorites", favorites: favs });
    }
  }).catch(function (_e) {
    // No saved favorites
  });
}

restoreState();
restoreFavorites();

figma.ui.onmessage = function (msg) {
  if (msg.type === "resize") {
    if (msg.width && msg.height) {
      figma.ui.resize(msg.width, msg.height);
    }
  } else if (msg.type === "save-state") {
    if (msg.state) {
      figma.clientStorage.setAsync("pulse-radio-state", msg.state).catch(function (_e) {
        // Storage error
      });
    }
  } else if (msg.type === "get-state") {
    restoreState();
    restoreFavorites();
  } else if (msg.type === "save-favorites") {
    if (msg.favorites) {
      figma.clientStorage.setAsync("pulse-radio-favorites", msg.favorites).catch(function (_e) {
        // Storage error
      });
    }
  } else if (msg.type === "toast") {
    if (msg.message) {
      figma.notify(msg.message, { timeout: 2000 });
    }
  } else if (msg.type === "storage-set") {
    if (msg.key) {
      figma.clientStorage.setAsync("pulse-radio-" + msg.key, msg.value).catch(function (_e) {
        // Storage error
      });
    }
  } else if (msg.type === "close") {
    figma.closePlugin();
  }
};
