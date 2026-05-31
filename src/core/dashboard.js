// dashboard.js

import { getDashboardConfig } from "./config-provider.js";

export function renderDashboard(state, deps) {
  const {
    layoutEngine,
    componentRegistry,
    logger = console
  } = deps;

  // 1. Validate module
  if (state.module !== "dashboard") return;

  // 2. Load config
  const config = getDashboardConfig(state.name);

  if (!config) {
    logger.error(`Dashboard config not found: ${state.name}`);
    return;
  }

  // 3. Parse test mode
  const testMode = parseTestMode(state.test);

  // 4. Build context
  const context = {
    config,
    filters: state.filters,
    lang: state.lang,
    theme: state.theme,
    log: state.log,
    testMode
  };

  // 5. Clear UI
  layoutEngine.clear();

  // 6. Render layout
  const layoutResult = layoutEngine.render(context);

  // 7. Initialize components (based on test mode)
  if (shouldRenderComponents(testMode)) {
    initComponents(layoutResult, context, componentRegistry);
  }

  return context; // ✅ return for testing
}

// ===== TEST MODE =====
function parseTestMode(test) {
  if (!test) return null;

  const modes = test.split("+");

  return {
    layout: modes.includes("layout"),
    grid: modes.includes("grid"),
    chart: modes.includes("chart"),
    filter: modes.includes("filter")
  };
}

function shouldRenderComponents(testMode) {
  if (!testMode) return true;
  return testMode.grid || testMode.chart || testMode.filter;
}

// ===== COMPONENT INIT =====
function initComponents(layoutResult, context, registry) {
  const { config, testMode } = context;

  config.groups.forEach(group => {
    group.rows.forEach(row => {
      row.components.forEach(comp => {
        if (!shouldRenderComponent(comp.type, testMode)) return;

        const component = registry[comp.type];
        if (component?.init) {
          component.init(comp, context);
        }
      });
    });
  });
}

function shouldRenderComponent(type, testMode) {
  if (!testMode) return true;

  if (testMode.layout) {
    // layout-only → no components
    return false;
  }

  return testMode[type] === true;
}
