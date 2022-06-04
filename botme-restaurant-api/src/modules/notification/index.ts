import orderNotificationRouter  from "./order-notification/router"
import  summaryNotificationRouter  from "./summary-notification/router";
import  emailRouter from "./email/router"


export default [
    ...orderNotificationRouter,
    ...summaryNotificationRouter,
    ...emailRouter
];