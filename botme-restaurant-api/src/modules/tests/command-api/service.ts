import { http } from "../../../utils/http-client";
var conf = require('config');

export async function processIteration(data: Array<object>) {
    let result: any[] = []

    await asyncForEach(data, async (obj: any, index: number, array: any) => {
        console.log(index, array.length);
        let body = {
            "text": obj.command,
            "pageId": obj.pageId,
            "sectionId": obj.sectionId,
            "entities": JSON.parse(obj.entities)
        };
        await http(conf.get('commandsApi'), '/response', "POST", JSON.stringify(body))
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
    return result
}



async function asyncForEach(array: Array<any>, callback: any) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}