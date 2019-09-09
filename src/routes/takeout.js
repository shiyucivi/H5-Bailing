import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "foods",
    path: "/order/takeout/foods",
    component: asyncComponent(() => import("../view/takeout/foodsList"))
  },
  {
    name: "Comments",
    path: "/order/takeout/comments",
    component: asyncComponent(() => import("../view/takeout/comments"))
  },

  {
    name: "TakeoutDetail",
    path: "/order/takeout/detail/:id",
    component: asyncComponent(() => import("../view/takeout/detail"))
  },
  {
    name: "ConfirmTakeout",
    path: "/order/takeout/confirm",
    component: asyncComponent(() => import("../view/takeout/confirm"))
  },
  {
    name: "TakeoutPage",
    path: "/order/takeout/:id",
    component: asyncComponent(() => import("../view/takeout/"))
  }
];
