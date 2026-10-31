(function () {
  "use strict";

  var dataEl = document.getElementById("resources-data");
  var searchInput = document.getElementById("search");
  var countEl = document.getElementById("count");
  var freeOnly = document.getElementById("free-only");
  var filters = document.querySelectorAll(".filter");
  var groups = document.querySelectorAll(".group-section");
  var cards = document.querySelectorAll(".resource-card");

  var DATA = {};
  try {
    DATA = JSON.parse(dataEl.textContent);
  } catch (err) {
    console.error("Failed to load embedded resource data", err);
    return;
  }

  var activeGroup = "all";
  var showFreeOnly = false;

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlight(text, query) {
    var q = query.trim();
    if (!q) {
      return esc(text);
    }
    var re = new RegExp(
      "(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi"
    );
    return esc(text).replace(re, '<mark>$1</mark>');
  }

  function isFree(card) {
    var cost = (card.getAttribute("data-cost") || "").toLowerCase();
    return /free/.test(cost) && !/fee/.test(cost);
  }

  function render() {
    var query = searchInput ? searchInput.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var descEl = card.querySelector(".card-desc");
      var titleEl = card.querySelector(".card-title");
      var groupMatch =
        card.getAttribute("data-group") === activeGroup || activeGroup === "all";
      var freeMatch = !showFreeOnly || isFree(card);

      var blob =
        (card.getAttribute("data-group") || "") +
        " " +
        (titleEl ? titleEl.textContent : "") +
        " " +
        (descEl ? descEl.textContent : "") +
        " " +
        (card.querySelector(".card-meta") ? card.querySelector(".card-meta").textContent : "");

      var queryMatch = query === "" || blob.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      var show = groupMatch && freeMatch && queryMatch;

      card.style.display = show ? "" : "none";

      if (show) {
        if (descEl) {
          descEl.innerHTML = highlight(descEl.textContent, query);
        }
        if (titleEl) {
          titleEl.innerHTML = highlight(titleEl.textContent, query);
        }
        visible += 1;
      } else {
        if (descEl) {
          descEl.innerHTML = esc(descEl.textContent);
        }
        if (titleEl) {
          titleEl.innerHTML = esc(titleEl.textContent);
        }
      }
    });

    var anyNoResults = true;
    groups.forEach(function (section) {
      var hasVisible = Array.from(section.querySelectorAll(".resource-card")).some(
        function (c) {
          return c.style.display !== "none";
        }
      );
      section.style.display = hasVisible ? "" : "none";
      if (hasVisible) anyNoResults = false;
    });

    if (countEl) {
      countEl.textContent =
        visible + " result" + (visible === 1 ? "" : "s");
    }
    var noResultsEl = document.getElementById("no-results");
    if (noResultsEl) {
      noResultsEl.style.display = anyNoResults ? "" : "none";
    }
  }

  function setActiveFilter(button) {
    filters.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    activeGroup = button.getAttribute("data-group");
  }

  if (searchInput) {
    searchInput.addEventListener("input", render);
  }

  if (freeOnly) {
    freeOnly.addEventListener("change", render);
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      setActiveFilter(button);
      render();
    });
  });

  render();
})();
