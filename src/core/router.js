// router.js

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
    const hash = window.location.hash || "";

    const [routePart, queryString] = hash.replace("#", "").split("?");

    // Step 1: Parse module + name
    const [type, name] = routePart.split("_");

    const module = this.mapType(type);

    // Step 2: Default state
    const state = {
      module: module,
      name: name || null,
      filters: {},
      lang: "en",
      theme: "light",
      log: "none",
      test: null
    };

    // Step 3: Parse query params
    if (queryString) {
      const params = new URLSearchParams(queryString);

      params.forEach((value, key) => {
        if (key.startsWith("f_")) {
          // Filter param
          const filterKey = key.replace("f_", "");
          state.filters[filterKey] = value;
        } else if (key.startsWith("sys_")) {
          // System param
          const sysKey = key.replace("sys_", "");
          this.assignSystemParam(state, sysKey, value);
        }
        // else → ignore (strict mode)
      });
    }

    // Step 4: Save & emit
    this.currentState = state;
    this.emit(state);
  }

  mapType(type) {
    switch (type) {
      case "DB":
        return "dashboard";
      default:
        return null;
    }
  }

  assignSystemParam(state, key, value) {
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
      default:
        // unknown sys param → ignore
        break;
    }
  }
}

export default Router;