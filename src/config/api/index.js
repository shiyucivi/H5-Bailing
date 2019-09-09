import * as orderApi from "./order";
import * as payApi from "./pay";
import * as userApi from "./user";
import * as cookbookApi from "./cookbook";

const defaultApi = Object.assign({}, orderApi, payApi, userApi, cookbookApi);

export default defaultApi;
