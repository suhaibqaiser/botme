import restaurantRouter from "./food/restaurant/router"
import customerRouter from "./food/customer/router"
import tableRouter from "./food/table/router"
import reservationRouter from "./food/reservation/router"
import categoryRouter from "./dictionary/category/router"
import productRouter from "./dictionary/product/router"
import menuRouter from "./food/menu/router"
import orderRouter from "./food/order/router"
import commandApiRouter from "./tests/command-api/router"
import notificationsRouter from "./notification/order-notification/router"
import SummaryNotificationRouter from "./notification/summary-notification/router"
import emailRouter from "./notification/email/router"

export default [
    ...customerRouter,
    ...restaurantRouter,
    ...tableRouter,
    ...reservationRouter,
    ...categoryRouter,
    ...productRouter,
    ...menuRouter,
    ...orderRouter,
    ...commandApiRouter,
    ...notificationsRouter,
    ...SummaryNotificationRouter,
    ...emailRouter
];