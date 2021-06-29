import restaurantRouter from "./restaurant/router"
import customerRouter from "./customer/router"
import tableRouter from "./table/router"
import reservationRouter from "./reservation/router"
import categoryRouter from "./category/router"
import productRouter from "./product/router"

export default [
    ...customerRouter,
    ...restaurantRouter,
    ...tableRouter,
    ...reservationRouter,
    ...categoryRouter,
    ...productRouter
];