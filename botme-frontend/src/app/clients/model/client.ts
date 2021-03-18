export interface IClient {
    _id: string,
    clientDeviceId: string;
    clientID: string;
    clientSecret: string;
    clientCreated: string;
    clientUpdated: string;
    clientActive: boolean;
    clientComment: string;
}