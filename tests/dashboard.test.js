import { renderDashboard } from "../src/core/dashboard.js";
import { assertEqual } from "./assert.js";

// Mock dependencies
const mockLayout = {
  cleared: false,
  rendered: false,
  clear() {
    this.cleared = true;
  },
  render(context) {
    this.rendered = true;
    this.context = context;
    return { containers: [] };
  }
};

const mockRegistry = {
  chart: {
    init: () => (global.__chartInit = true)
  },
  grid: {
    init: () => (global.__gridInit = true)
  }
};

//------Test 1----------------
global.__chartInit = false;
global.__gridInit = false;

renderDashboard(
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  {
    layoutEngine: mockLayout,
    componentRegistry: mockRegistry
  }
);

assertEqual(mockLayout.cleared, true, "Layout cleared");
assertEqual(mockLayout.rendered, true, "Layout rendered");
assertEqual(global.__chartInit, true, "Chart initialized");
assertEqual(global.__gridInit, true, "Grid initialized");

//------Test 2: Layout-only----------------
global.__chartInit = false;
global.__gridInit = false;

renderDashboard(
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  {
    layoutEngine: mockLayout,
    componentRegistry: mockRegistry
  }
);

assertEqual(mockLayout.cleared, true, "Layout cleared");
assertEqual(mockLayout.rendered, true, "Layout rendered");
assertEqual(global.__chartInit, true, "Chart initialized");
assertEqual(global.__gridInit, true, "Grid initialized");

//------Test 3: layout + chart----------------

global.__chartInit = false;
global.__gridInit = false;

renderDashboard(
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  {
    layoutEngine: mockLayout,
    componentRegistry: mockRegistry
  }
);

assertEqual(mockLayout.cleared, true, "Layout cleared");
assertEqual(mockLayout.rendered, true, "Layout rendered");
assertEqual(global.__chartInit, true, "Chart initialized");
assertEqual(global.__gridInit, true, "Grid initialized");

//------------------- TEST 4 Invalid Dashboard------------------
const result = renderDashboard(
  {
    module: "dashboard",
    name: "Unknown"
  },
  {
    layoutEngine: mockLayout,
    componentRegistry: mockRegistry,
    logger: { error: () => (global.__error = true) }
  }
);

assertEqual(global.__error, true, "Error logged for missing config");