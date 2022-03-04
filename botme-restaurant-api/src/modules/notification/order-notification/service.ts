import { Subscribe } from "./model";

export async function AddSubscription(data:any) {
    return Subscribe.create(data)
}
export async function FindSubscription(data:any) {
    await GetAllSubscription()
    var data = await Subscribe.find(data)
    return data
}
export async function GetAllSubscription() {
    var data = await Subscribe.find({})
    return data 
    // var result = data[0]
    // return result
}
export async function deleteAllSubscription(){
    return await Subscribe.deleteMany()
}
export async function deleteSubscription(req:any) {
    console.log("subscribe deleting")
    return await Subscribe.deleteOne(req)
    
}