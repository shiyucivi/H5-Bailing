import { asyncComponent } from "./asyncComponent";

export default [
  {
    name: "CookBookPage",
    path: "/cookbook/:id",
    component: asyncComponent(() => import("../view/cookbook"))
  }
];
