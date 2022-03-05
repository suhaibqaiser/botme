import orderNotificationRouter  from "./order-notification/router"
import  summaryNotificationRouter  from "./summary-notification/router";

export default [
    ...orderNotificationRouter,
    ...summaryNotificationRouter
];