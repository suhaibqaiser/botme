import { Client } from 'undici'
import { HttpMethod } from 'undici/types/dispatcher'

export async function http(url: string, path: string, method: HttpMethod, reqbody: any): Promise<any> {
    let result

    const client = new Client(url)
    client.on('connect', (origin: string) => {
        console.log(`Connected to ${origin}`)
    })

    try {
        const { body } = await client.request({
            path: path,
            method: method,
            body: reqbody,
            headers: ['User-Agent', 'PostmanRuntime/7.28.4', 'Content-Type', 'application/json']
        })

        body.setEncoding('utf-8')
        result = await body.json()
        client.close()
    } catch (error) {
        client.close()
        result = "Error in api call: " + error;
        console.log(error);

    }
    return result
}