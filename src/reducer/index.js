import { createStore, combineReducers, applyMiddleware } from "redux";
import { orderReducer } from "./reducers/order";
import { userReducer } from "./reducers/user";
import createSagaMiddleware from "redux-saga";
import mySaga from "./effects";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  orderReducer,
  userReducer
});
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
// then run the saga
sagaMiddleware.run(mySaga);
export default store;
