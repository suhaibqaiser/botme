export interface IClient {
    clientDeviceId: string;
    clientID: string;
    clientName: string;
    clientSecret: string;
    clientDebug: boolean,
    clientVoiceEnabled: boolean,
    clientVoiceTimeout: number,
    clientCreated: string;
    clientUpdated: string;
    clientActive: boolean;
    clientComment: string;
    restaurantId: string;
}
