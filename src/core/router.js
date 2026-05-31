// ===== PURE FUNCTION (for testing) =====
export function parseRoute(hash) {
  const [routePart, queryString] = hash.replace("#", "").split("?");

  const [type, name] = routePart.split("_");

  const state = {
    module: mapType(type),
    name: name || null,
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  };

  if (queryString) {
    const params = new URLSearchParams(queryString);

    params.forEach((value, key) => {
      if (key.startsWith("f_")) {
        state.filters[key.replace("f_", "")] = value;
      } else if (key.startsWith("sys_")) {
        assignSystemParam(state, key.replace("sys_", ""), value);
      }
      // strict mode → ignore others
    });
  }

  return state;
}

// ===== HELPERS =====
function mapType(type) {
  switch (type) {
    case "DB":
      return "dashboard";
    default:
      return null;
  }
}

function assignSystemParam(state, key, value) {
  switch (key) {
    case "lang":
      state.lang = value;
      break;
    case "theme":
      state.theme = value;
      break;
    case "log":
      state.log = value;
      break;
    case "test":
      state.test = value;
      break;
  }
}

// ===== ROUTER CLASS (uses parseRoute) =====
class Router {
  constructor() {
    this.currentState = null;
    this.listeners = [];

    window.addEventListener("hashchange", () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  emit(state) {
    this.listeners.forEach(cb => cb(state));
  }

  handleRoute() {
    const state = parseRoute(window.location.hash); // ✅ HERE

    this.currentState = state;
    this.emit(state);
  }
}

export default Router;