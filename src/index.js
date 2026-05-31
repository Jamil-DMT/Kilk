import Router from "./core/router.js";

const router = new Router();

router.onChange((state) => {
  console.log("Route changed:", state);
});

router.init();