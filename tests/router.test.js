console.log("Test file running...");
import { parseRoute } from "../src/core/router.js";

function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);

  if (a !== e) {
    console.error("❌ FAIL:", message);
    console.log("Expected:", expected);
    console.log("Actual:", actual);
  } else {
    console.log("✅ PASS:", message);
  }
}

assertEqual(
  parseRoute("#DB_Sales"),
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  "Basic route parsing"
);

assertEqual(
  parseRoute("#DB_Sales?f_status=Active"),
  {
    module: "dashboard",
    name: "Sales",
    filters: { status: "Active" },
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  "Filter parsing"
);

assertEqual(
  parseRoute("#DB_Sales?sys_lang=ar&sys_theme=dark"),
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "ar",
    theme: "dark",
    log: "none",
    test: null
  },
  "System params parsing"
);

assertEqual(
  parseRoute("#DB_Sales?f_status=Active&sys_test=layout"),
  {
    module: "dashboard",
    name: "Sales",
    filters: { status: "Active" },
    lang: "en",
    theme: "light",
    log: "none",
    test: "layout"
  },
  "Mixed parsing"
);

assertEqual(
  parseRoute("#DB_Sales?status=Active&random=123"),
  {
    module: "dashboard",
    name: "Sales",
    filters: {},
    lang: "en",
    theme: "light",
    log: "none",
    test: null
  },
  "Invalid params ignored"
);