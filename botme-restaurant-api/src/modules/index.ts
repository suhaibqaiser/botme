import restaurantRouter from "./restaurant/router"
import customerRouter from "./customer/router"
import tableRouter from "./table/router"
import reservationRouter from "./reservation/router"

export default [
    ...customerRouter,
    ...restaurantRouter,
    ...tableRouter,
    ...reservationRouter
];