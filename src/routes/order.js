import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "订单中心",
    path: "/",
    component: asyncComponent(() => import("../view/order"))
  }
];
