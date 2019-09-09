import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "MovieOrderPage",
    path: "/order/movie",
    component: asyncComponent(() => import("../view/movie"))
  },
  {
    name: "MovieOrderDetail",
    path: "/order/movie/detail/:id",
    component: asyncComponent(() => import("../view/movie/movieOrderDetail"))
  }
];
