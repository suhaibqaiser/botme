import { Subscribe } from "./model";

export async function AddSubscription(data:any) {
    return await Subscribe.create(data)
}
export async function checkIfSubscriptionExists(data:any) {
    return await Subscribe.exists({"subscription.endpoint":data.subscription.endpoint,"notificationType":data.notificationType,"restaurantId":data.restaurantId})
}
export async function GetAllSubscription(restaurantId:any) {
    return await Subscribe.find({"restaurantId":restaurantId})
}
export async function updateSubscription(req:any) {
    return await Subscribe.findOneAndUpdate({"subscription.endpoint":req.subscription.endpoint,"restaurantId":req.restaurantId},req)
    
}
export async function deleteAllSubscription(){
    return await Subscribe.deleteMany()
}
export async function deleteSubscription(endpoint:any) {
    return await Subscribe.deleteOne({"subscription.endpoint":endpoint})
    
}