import restaurantRouter from "./restaurant/router"
import customerRouter from "./customer/router"
import tableRouter from "./table/router"
import reservationRouter from "./reservation/router"
import menuRouter from "./menu/router"
import orderRouter from "./order/router"
import productRouter from "./product/router"
import categoryRouter from "./category/router"

export default [
    ...customerRouter,
    ...restaurantRouter,
    ...tableRouter,
    ...reservationRouter,
    ...menuRouter,
    ...orderRouter,
    ...productRouter,
    ...categoryRouter
];