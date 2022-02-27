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
    let subscriptionObj :any ={}
    var data = await Subscribe.find({})
    for (let i=0; i<data.length;i++){
        subscriptionObj = data[i]
    }
    console.log(subscriptionObj)
    return subscriptionObj 
    // var result = data[0]
    // return result
}
export async function deleteAllSubscription(){
    return await Subscribe.deleteMany()
}