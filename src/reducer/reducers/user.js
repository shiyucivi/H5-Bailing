const initUserState = {
  pansengers: [],
  contactInfo: [],
  addressInfo: {
    // address_code: ["110000", "110100", "110101"],
    adcode: "",

    consignee: "",
    consigneeMobile: "",
    addressProvince: "",
    addressCity: "",
    addressDistrict: "",
    addressRegion: "",
    addressDetail: "",
    createId: 0,
    latitude: "",
    longitude: ""

    // default: true,
    // fullAddress: "北京市北京市海淀区八家嘉园15号楼2单元504",

    // addressId: 15265,
    // addressType: "1",

    // modifyTime: "2019-06-20 19:36:09",
    // poiId: "",
    // thirdpartyId: "0",
  },
  current_address: {}
};
export const userReducer = (state = initUserState, action) => {
  switch (action.type) {
    case "SETPANSENGERS":
      return Object.assign({}, state, {
        pansengers: action.list
      });
    case "SETCONTACTINFO":
      return Object.assign({}, state, {
        contactInfo: action.obj
      });

    case "SETADDRESSES":
      return Object.assign({}, state, {
        addresses: action.obj
      });
    case "SETADRESSINFO":
      return Object.assign({}, state, {
        addressInfo: action.obj
      });
    case "SETCURRENTADDRESS":
      return Object.assign({}, state, {
        current_address: action.obj
      });
    default:
      return state;
  }
};
