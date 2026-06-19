"use strict";

/*
  Squiz Matrix renders seized item cards server-side via asset listing and
  metadata keywords. No client-side templating is required here.
*/
(function initSeizedItemsEnhancements() {
  const grid = document.getElementById("seized-items-grid");
  if (!grid) {
    return;
  }

  // Small hook for styling/debugging if needed.
  grid.setAttribute("data-js-enhanced", "true");
})();
