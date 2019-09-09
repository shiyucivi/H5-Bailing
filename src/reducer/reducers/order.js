const initOrderState = {
  orderArr: [],
  scrolerY: 0,
  tab: 0,
  listState: {
    scrollTop: 0,
    datas: [],
    pageIndex: 0,
    page_size: 10,
    dataArr: []
  },
  order: {
    baggage_rule: { baby_baggage: [""] },
    change_info: { change_text: "" },
    order_status_name: "",
    contact_info: { name: "", mobile: "", email: "" },
    price_info: {
      adult_bare_price: 1543,
      arf: 50,
      baby_bare_price: 220,
      child_bare_price: 1120,
      child_tof: 0,
      tof: 0
    },
    product_items: [
      {
        attributes: [{ value: "" }, { value: "" }],
        product_name: ""
      }
    ],
    flight_info: {
      adult_cabin: "",
      arr: "",
      arr_airport: null,
      arr_city: "",
      arr_date: "",
      arr_terminal: "",
      arr_time: "",
      baby_cabin: "",
      carrier_name: "",
      dpt: "",
      dpt_airport: null,
      dpt_city: "",
      dpt_date: "",
      dpt_terminal: "",
      dpt_time: "",
      flight_num: "",
      flight_times: "",
      logo_url: "",
      plane_code: "",
      stop_airport: null,
      stop_city: null,
      stops: 0,
      week: ""
    }
  },
  // takeoutOrder: {
  //     product_desc: "",
  //     stock_id: "",
  //     promotion_name: "",
  //     unit_price: -1,
  //     promotion_price: -1,
  //     quantity: -1,
  //     attributes: [
  //         {
  //             name: "",
  //             value: "",
  //             extra: ""
  //         }
  //     ],
  //     product_id: "",
  //     product_name: ""
  // },
  hotelOrder: {
    address: "",
    checkin_date: "",
    checkin_names: "",
    checkin_tips: "",
    checkout_date: "",
    comment: "",
    commodity_category: 3,
    contact: "",
    contact_phone: "",
    create_time: "",
    merchant_contact: "",
    order_code: "",
    order_name: "",
    detail: [0, 0, 0, 0],
    order_status: "",
    order_status_list: "",
    order_status_name: "",
    original_total_price: 0,
    product_items: [
      {
        attributes: [],
        product_desc: "",
        product_id: "",
        product_name: "",
        promotion_name: "",
        promotion_price: 0,
        quantity: 1,
        stock_id: "",
        unit_price: 0
      }
    ],
    promotion_items: [],
    room_name: "",
    room_num: 1,
    show_pic_url:
      "http://p0.meituan.net/tdchotel/b5c63e7d6e1bb5fed779cc8d361a7c0177609.jpg",
    stay_day_num: "",
    timeout: "",
    total_price: 0,
    show: true
  },
  topic: "nonono",
  seatMap: [],
  selectSeat: [],
  foodList: [],
  takeoutOrderInfo: {
    extra_lvl1: "",
    extra_lvl2: "",
    merchant_id: "",
    merchant_longitude: "",
    merchant_latitude: ""
  }
};
export const orderReducer = (state = initOrderState, action) => {
  switch (action.type) {
    case "fetchOrder":
      return {
        ...state,
        topic: action.topic
      };
    case "SETORDERARR":
      return Object.assign({}, state, {
        orderArr: action.orderArr
      });
    case "SCROLERY":
      return Object.assign({}, state, {
        scrolerY: action.scrolerY
      });
    case "SETORDERTABS":
      return Object.assign({}, state, {
        tab: action.tab
      });
    case "SETORDER":
      return Object.assign({}, state, {
        order: action.order
      });
    case "SETHOTELORDER":
      return Object.assign({}, state, {
        hotelOrder: action.hotelOrder
      });
    case "SETPANSENGERS":
      return Object.assign({}, state, {
        pansengers: action.list
      });
    case "SETADDRESSES":
      return Object.assign({}, state, {
        addresses: action.list
      });
    case "SETCONTACTINFO":
      return Object.assign({}, state, {
        contactInfo: action.obj
      });
    case "SETLISTSTATE":
      return Object.assign({}, state, {
        listState: action.obj
      });
    case "MOVIESEATMAP":
      return Object.assign({}, state, {
        seatMap: action.seatMap
      });
    case "SETSELECTSEAT":
      return Object.assign({}, state, {
        selectSeat: action.arr
      });
    case "SETTAKEOUTFOODS":
      return Object.assign({}, state, {
        foodList: action.list
      });
    case "SETTAKEOUTORDERINFO":
      return Object.assign({}, state, {
        takeoutOrderInfo: action.obj
      });
    default:
      return state;
  }
};
