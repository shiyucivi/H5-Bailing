import * as Pages from "./action-type";

export const setScrolerY = scrolerY => {
  return {
    type: Pages.SCROLERY,
    scrolerY
  };
};
export const setOrderArr = orderArr => {
  return {
    type: Pages.SETORDERARR,
    orderArr
  };
};

export const setOrderTabs = tab => {
  console.log("====================================");
  console.log("change tab", tab);
  console.log("====================================");
  return {
    type: Pages.SETORDERTABS,
    tab
  };
};
export const sendMessage = orderArr => {
  return {
    type: Pages.SENDMESSAGE,
    orderArr
  };
};
export const setOrder = order => {
  return {
    type: Pages.SETORDER,
    order
  };
};
export const setHotelOrder = hotelOrder => {
  return {
    type: Pages.SETHOTELORDER,
    hotelOrder
  };
};
export const setPansengers = list => {
  return {
    type: Pages.SETPANSENGERS,
    list
  };
};
export const setAddresses = list => {
  return {
    type: Pages.SETADDRESSES,
    list
  };
};

export const contactInfo = obj => {
  return {
    type: Pages.SETCONTACTINFO,
    obj
  };
};

export const setListState = obj => {
  return {
    type: Pages.SETLISTSTATE,
    obj
  };
};
export const fetchMovieSeatmap = (obj, fn) => {
  return {
    type: "fetchMovieSeatmap",
    obj,
    fn
  };
};
export const setSelectSeat = arr => {
  return {
    type: Pages.SETSELECTSEAT,
    arr
  };
};
export const setSeatMap = arr => {
  return {
    type: Pages.SETSEATMAP,
    arr
  };
};

export const setAddressesInfo = obj => {
  return {
    type: Pages.SETADRESSINFO,
    obj
  };
};
export const setFoodList = list => {
  return {
    type: Pages.SETTAKEOUTFOODS,
    list
  };
};
export const setCurrentAddress = obj => {
  return {
    type: Pages.SETCURRENTADDRESS,
    obj
  };
};
export const setTakeoutOrderInfo = obj => {
  return {
    type: Pages.SETTAKEOUTORDERINFO,
    obj
  };
};
