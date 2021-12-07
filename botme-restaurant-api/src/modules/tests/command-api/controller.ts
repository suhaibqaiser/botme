import { restResponse } from "../../../utils/response";
import { processIteration } from "./service";
import csv from 'csvtojson'

export async function processFile(req: any) {
    let response = new restResponse()


    if (!req.files) {
        response.payload = "file is required"
        response.status = "error"
        return response;
    }
    let file = req.files.test
    if (file.mimetype != 'text/csv') {
        response.payload = "Only csv file is allowed"
        response.status = "error"
        return response;
    }
    let csvObj = await csv().fromString(file.data.toString())
    let result = await processIteration(csvObj)

    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "error in processing request"
        response.status = "error"
        return response
    }



}
