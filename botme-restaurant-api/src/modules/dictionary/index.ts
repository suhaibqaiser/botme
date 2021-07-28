import categoryRouter from "./category/router"
import productRouter from "./product/router"

export default [
    ...categoryRouter,
    ...productRouter,
];