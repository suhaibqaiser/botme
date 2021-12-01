import { restResponse } from "../../../utils/response";
import csv from 'csvtojson'
import { http } from "../../../utils/http-client";

export async function processFile(req: any) {
    let response = new restResponse()
    let result: any[] = []

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


    await asyncForEach(csvObj, async (obj: any, index: number, array: any) => {
        console.log(index, array.length);
        let body = {
            "text": obj.command,
            "pageId": obj.pageId,
            "sectionId": obj.sectionId
        };
        await http('http://api.gofindmenu.com:5010', '/response', "POST", JSON.stringify(body))
            .then(response => {
                let actualResult = (obj.response === response.Response)
                let res = {
                    command: body.text,
                    pageId: body.pageId,
                    sectionId: body.sectionId,
                    expectedResponse: obj.response,
                    actualResponse: response.Response,
                    passed: actualResult
                }
                result.push(res)
            })
            .catch(error => result.push(error));
        await sleep(500)
        // if (index === array.length - 1) console.log(result);
    });


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

async function asyncForEach(array: Array<any>, callback: any) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}