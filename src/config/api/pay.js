import util from "../../util/JsonUtil";
import {
  commom,
  getAuth,
  post,
  DEVICE_SYSTEM_CATEGORY
} from "../../util/fetch";
import { Toast } from "antd-mobile";

/**
 *支付
 */
const pay = json => {
  // 如果判读需要扫码支付则不跳转app支付
  if (DEVICE_SYSTEM_CATEGORY) {
    window.location.replace(`#/qrPay/${json.order_code}`);
    return false;
  }
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/pay`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      const _res = res.data.data.json;
      if (_res.status == 0 && _res.message == "SUCCESS") {
        if (_res.data.pay_data) {
          if (Number(json.pay_channel) == 7) {
            let url = JSON.parse(JSON.parse(_res.data.pay_data)).url;
            window.location.href = url;
          } else {
            const div = document.createElement("div");
            div.innerHTML = JSON.parse(_res.data.pay_data); //res.data是返回的表单
            document.body.appendChild(div);
            document.forms.punchout_form.submit();
          }
        } else {
          Toast.info(_res.message, 2);
        }
        Toast.info("支付跳转", 2);
      } else {
        Toast.info(res.data.data.json.message, 2);
      }
    } else {
      return null;
    }
  });
};

const payQrCOde = json => {
  let obj = util.deepClone(commom);
  obj.json = JSON.stringify(json);
  obj = getAuth(obj);
  let _url = `trade/order/pay`;
  return post(_url, obj).then(res => {
    if (res.status === 200) {
      const _res = res.data.data.json;
      if (_res.status == 0 && _res.message == "SUCCESS") {
        if (_res.data.pay_data) {
          if (Number(json.pay_channel) == 9) {
            return JSON.parse(_res.data.pay_data);
          } else {
            Toast.info("错误的渠道", 2);
            return null;
          }
        } else {
          Toast.info(_res.message, 2);
        }
        Toast.info("支付跳转", 2);
      } else {
        Toast.info(res.data.data.json.message, 2);
      }
    } else {
      return null;
    }
  });
};

export { pay, payQrCOde };
