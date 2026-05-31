import { handleAction } from "../src/core/navigation.js";
import { assertEqual } from "./assert.js";

global.window = {
  location: {
    hash: ""
  },
  open: (url, target) => {
    global.__lastOpen = { url, target };
  }
};

window.location.hash = "";

handleAction({
  type: "navigate",
  target: "DB_Sales",
  params: { status: "Active" },
  mode: "same"
});

assertEqual(
  window.location.hash,
  "DB_Sales?f_status=Active",
  "Navigate (same tab)"
);

global.__lastOpen = null;

handleAction({
  type: "navigate",
  target: "DB_Sales",
  params: { status: "Active" },
  mode: "new"
});

assertEqual(
  global.__lastOpen,
  { url: "#DB_Sales?f_status=Active", target: "_blank" },
  "Navigate (new tab)"
);

window.location.hash = "DB_Sales";

handleAction({
  type: "applyFilter",
  params: { status: "Live" }
});

assertEqual(
  window.location.hash,
  "DB_Sales?f_status=Live",
  "Apply filter"
);

window.location.hash = "DB_Sales?f_status=Live";

handleAction({
  type: "clearFilter"
});

assertEqual(
  window.location.hash,
  "DB_Sales",
  "Clear filter"
);

