export interface Signup {
    userId: string,
    userName: string,
    userSecret: string,
    userFullName: string,
    userEmail: string,
    userToken: string,
    userCreated: Date,
    userUpdated: Date | null,
    userActive: boolean,
    userComment: string,
    restaurantId: string
}