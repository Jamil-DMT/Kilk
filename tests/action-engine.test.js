import { processEvent } from "../src/core/action-engine.js";

function deepEqual(a, b) {
  return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
}

function sortObject(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) return obj.map(sortObject);

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {});
}

function assertEqual(actual, expected, message) {
  if (!deepEqual(actual, expected)) {
    console.error("❌ FAIL:", message);
    console.log("Expected:", expected);
    console.log("Actual:", actual);
  } else {
    console.log("✅ PASS:", message);
  }
}
//------------------- TEST CASE 1 ------------------
const config = {
  actions: [
    {
      on: { source: "chart", type: "click" },
      do: {
        type: "navigate",
        target: "DB_Details",
        mode: "same",
        map: {
          status: "payload.value"
        }
      }
    }
  ]
};

const event = {
  source: "chart",
  type: "click",
  payload: { value: "Active" }
};

assertEqual(
  processEvent(event, config),
  {
    type: "navigate",
    target: "DB_Details",
    mode: "same",
    params: {
      status: "Active"
    }
  },
  "Chart click → navigate"
);
//------------------- TEST CASE 2 ------------------
const configNewTab = {
  actions: [
    {
      on: { source: "chart", type: "click" },
      do: {
        type: "navigate",
        target: "DB_Details",
        mode: "new",
        map: {
          status: "payload.value"
        }
      }
    }
  ]
};

assertEqual(
  processEvent(event, configNewTab),
  {
    type: "navigate",
    target: "DB_Details",
    mode: "new",
    params: {
      status: "Active"
    }
  },
  "Navigate new tab"
);
//------------------- TEST CASE 3 ------------------
const filterConfig = {
  actions: [
    {
      on: { source: "filter", type: "apply" },
      do: {
        type: "applyFilter",
        map: {
          status: "payload.filters.status"
        }
      }
    }
  ]
};

const filterEvent = {
  source: "filter",
  type: "apply",
  payload: {
    filters: { status: "Live" }
  }
};

assertEqual(
  processEvent(filterEvent, filterConfig),
  {
    type: "applyFilter",
    target: null,
    params: {
      status: "Live"
    }
  },
  "Filter apply"
);
//------------------- TEST CASE 4 ------------------
const noMatchEvent = {
  source: "grid",
  type: "unknown",
  payload: {}
};

assertEqual(
  processEvent(noMatchEvent, config),
  null,
  "No matching rule"
);
