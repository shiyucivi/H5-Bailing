import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "AddressList",
    path: "/address/list",
    component: asyncComponent(() => import("../view/address"))
  },
  {
    name: "UpdateAddress",
    path: "/address/updateAddress",
    component: asyncComponent(() => import("../view/address/Address"))
  },

  {
    name: "Citys",
    path: "/address/citys",
    component: asyncComponent(() => import("../view/address/citys"))
  },
  {
    name: "AddressSearch",
    path: "/address/search",
    component: asyncComponent(() => import("../view/address/search"))
  }
];
