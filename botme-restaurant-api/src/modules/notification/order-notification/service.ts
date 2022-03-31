import { Subscribe } from "./model";

export async function AddSubscription(data:any) {
    return Subscribe.create(data)
}
export async function FindSubscription(data:any) {
    await GetAllSubscription()
    var data = await Subscribe.find({"subscription.endpoint":data.subscription.endpoint})
    return data
}
export async function GetAllSubscription() {
    var data = await Subscribe.find({})
    return data 
    // var result = data[0]
    // return result
}
export async function updateSubscription(req:any) {
    var data = await Subscribe.findOneAndUpdate({"subscription.endpoint":req.subscription.endpoint},req)
    
}
export async function deleteAllSubscription(){
    return await Subscribe.deleteMany()
}
export async function deleteSubscription(req:any) {
    console.log("subscribe deleting")
    let result =  await Subscribe.deleteOne({"subscription.endpoint":req.subscription.endpoint})
    return result
    
}