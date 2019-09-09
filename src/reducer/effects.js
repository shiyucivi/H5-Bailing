import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import API from "../config/api";
import * as Pages from "./action-type";

//worder Safa
function* fetchOrder({ payload }) {
  try {
    const topic = yield call(API.demo, payload.obj);
    yield put({ type: "fetchOrder", topic: topic });
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}
/**
 *电影票座位图
 *
 * @param {*} { payload }
 */
function* fetchMovieSeatmap({ obj, fn }) {
  try {
    const movieSeatmap = yield call(API.getSeatMap, obj);
    if (movieSeatmap.sections && movieSeatmap.sections.length > 0) {
      yield put({
        type: "MOVIESEATMAP",
        seatMap: movieSeatmap.sections[0].seats
      });
    }

    yield fn(movieSeatmap);
  } catch (e) {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
  }
}

/**
 *异步监听
 *
 */
function* mySaga() {
  console.log("====================================");
  console.log("async watch");
  console.log("====================================");
  yield takeEvery("fetchOrder", fetchOrder);
  yield takeEvery("fetchMovieSeatmap", fetchMovieSeatmap);
}

export default mySaga;
