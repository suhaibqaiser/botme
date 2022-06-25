import orderNotificationRouter  from "./order-notification/router"
import  summaryNotificationRouter  from "./summary-notification/router";
import placeorderNotificationRouter from "./place-order-notification/router";

export default [
    ...orderNotificationRouter,
    ...summaryNotificationRouter,
    ...placeorderNotificationRouter
];