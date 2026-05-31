import { handleAction } from "../src/core/navigation.js";

global.window = {
  location: {
    hash: ""
  },
  open: (url, target) => {
    console.log("OPEN:", url, target);
  }
};

handleAction({
  type: "navigate",
  target: "DB_Sales",
  params: { status: "Active" },
  mode: "same"
});

console.log(window.location.hash);
// expected: "DB_Sales?f_status=Active"

handleAction({
  type: "navigate",
  target: "DB_Sales",
  params: { status: "Active" },
  mode: "new"
});
// OPEN: #DB_Sales?f_status=Active _blank

window.location.hash = "DB_Sales";

handleAction({
  type: "applyFilter",
  params: { status: "Live" }
});

console.log(window.location.hash);
// DB_Sales?f_status=Live

window.location.hash = "DB_Sales?f_status=Live";

handleAction({
  type: "clearFilter"
});

console.log(window.location.hash);
// DB_Sales

