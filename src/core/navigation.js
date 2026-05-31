// navigation.js

export function handleAction(action) {
  if (!action) return;

  switch (action.type) {
    case "navigate":
      handleNavigate(action);
      break;

    case "applyFilter":
      handleApplyFilter(action);
      break;

    case "clearFilter":
      handleClearFilter();
      break;

    default:
      // ignore unknown actions
      break;
  }
}

// ===== NAVIGATE =====
function handleNavigate(action) {
  const route = buildRoute(action.target, action.params);

  if (action.mode === "new") {
    window.open("#" + route, "_blank");
  } else {
    window.location.hash = route;
  }
}

// ===== APPLY FILTER =====
function handleApplyFilter(action) {
  const currentHash = window.location.hash;
  const [routePart] = currentHash.replace("#", "").split("?");

  const route = buildRoute(routePart, action.params);

  window.location.hash = route;
}

// ===== CLEAR FILTER =====
function handleClearFilter() {
  const currentHash = window.location.hash;
  const [routePart] = currentHash.replace("#", "").split("?");

  // remove all params
  window.location.hash = routePart;
}

// ===== ROUTE BUILDER =====
function buildRoute(target, params = {}) {
  let query = "";

  const entries = Object.entries(params);

  if (entries.length > 0) {
    const queryParams = entries.map(
      ([key, value]) => `f_${key}=${encodeURIComponent(value)}`
    );

    query = "?" + queryParams.join("&");
  }

  return target + query;
}