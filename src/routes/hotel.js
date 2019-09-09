import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "HotelOrderDetailsPage",
    path: "/order/hotel/",
    component: asyncComponent(() => import("../view/hotel"))
  },
  {
    name: "HotelOrderPayPage",
    path: "/order/hotel/pay/:id",
    component: asyncComponent(() => import("../view/hotel/pay"))
  },
  {
    name: "AudioHotelOrderPayPage",
    path: "/order/hotel/pay_audio/:id",
    component: asyncComponent(() => import("../view/hotel/AudioPayConfirm.jsx"))
  },

  {
    name: "HotelOrderDetailsPage",
    path: "/order/hotel/:id",
    component: asyncComponent(() => import("../view/hotel"))
  }
];
