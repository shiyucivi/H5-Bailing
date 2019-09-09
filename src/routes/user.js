import { asyncComponent } from "./asyncComponent";
export default [
  {
    name: "UserList",
    path: "/userList",
    component: asyncComponent(() => import("../view/user"))
  },
  {
    name: "UpdateUserPage",
    path: "/update",
    component: asyncComponent(() => import("../view/user/update"))
  }
];
