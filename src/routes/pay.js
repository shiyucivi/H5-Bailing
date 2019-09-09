import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "QrPay",
    path: "/qrPay/:id",
    component: asyncComponent(() => import("../view/movie/qrPay"))
  },

  {
    name: "PayConfirmPage",
    path: "/order/confirm/:id",
    component: asyncComponent(() => import("../view/movie/PayConfirm.jsx"))
  },
  {
    name: "PayResultPage",
    path: "/order/payresult/:paycode",
    component: asyncComponent(() => import("../view/movie/PayResult.jsx"))
  },

  {
    name: "PayResult",
    path: "/PayResult",
    component: asyncComponent(() => import("../view/pay"))
  }
];
