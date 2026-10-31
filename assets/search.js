(function () {
  "use strict";

  var dataEl = document.getElementById("resources-data");
  var searchInput = document.getElementById("search");
  var countEl = document.getElementById("count");
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

  var groupsById = {};
  DATA.groups.forEach(function (g) {
    groupsById[g.id] = g;
  });

  var activeGroup = "all";

  function matches(card, query) {
    var text = (
      card.dataset.group +
      " " +
      (card.querySelector(".card-title").textContent || "") +
      " " +
      (card.querySelector(".card-desc").textContent || "") +
      " " +
      (card.querySelector(".card-meta").textContent || "")
    ).toLowerCase();
    return query === "" || text.indexOf(query.toLowerCase()) !== -1;
  }

  function render() {
    var query = searchInput ? searchInput.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var show = card.dataset.group === activeGroup || activeGroup === "all";
      show = show && matches(card, query);
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    groups.forEach(function (section) {
      var hasVisible = Array.from(section.querySelectorAll(".resource-card")).some(
        function (c) {
          return c.style.display !== "none";
        }
      );
      section.style.display = hasVisible ? "" : "none";
    });

    if (countEl) {
      countEl.textContent = visible + " result" + (visible === 1 ? "" : "s");
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

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      setActiveFilter(button);
      render();
    });
  });

  render();
})();
