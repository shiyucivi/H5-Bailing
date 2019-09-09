import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "AirOrderPage",
    path: "/order/air",
    component: asyncComponent(() => import("../view/air"))
  },
  {
    name: "AirOrderPayPage",
    path: "/order/air/pay/:id",
    component: asyncComponent(() => import("../view/air/pay"))
  },
  {
    name: "AudioAirOrderPayPage",
    path: "/order/air/pay_audio/:id",
    component: asyncComponent(() => import("../view/air/AudioPayConfirm.jsx"))
  },

  {
    name: "AirOrderPage",
    path: "/order/air/:id",
    component: asyncComponent(() => import("../view/air"))
  }
];
