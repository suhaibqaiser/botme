export interface User {
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
    restaurantId: string,
    userRole: string,
    notificationType: string
    notificationState: boolean
}
