import { Subscription } from "./model";

export async function saveSubscriptions(data:any) {
    return Subscription.create(data)
}

export async function checkIfSubscriptionExist(parameter:any) {
    return Subscription.find({"subscription.endpoint":parameter.subscription.endpoint})
}

export async function getSubscriptionByClientId(clientId:any) {
    return Subscription.find({"clientId":clientId})
}