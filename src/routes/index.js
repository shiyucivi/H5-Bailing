import Order from "./order";
import Takeout from "./takeout";
import Movie from "./movie";
import Air from "./air";
import Hotel from "./hotel";
import Pay from "./pay";
import Address from "./address";
import User from "./user";
import CookBook from "./cookbook";

export default [
    ...Order,
    ...Takeout,
    ...Movie,
    ...Air,
    ...Hotel,
    ...Pay,
    ...Address,
    ...User,
    ...CookBook
];
