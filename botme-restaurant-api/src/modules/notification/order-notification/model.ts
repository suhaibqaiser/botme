import {createSchema, Type, typedModel} from 'ts-mongoose';
import {clientsDB} from '../../../config/mongoDB';

const SubscribeSchema = createSchema(
    {
      subscription:{
        endpoint: Type.string({maxlength: 256}),
        expirationTime: Type.string(),
        keys: {
          p256dh: Type.string({maxlength: 256}),
          auth: Type.string({maxlength: 256})
        },
      },
      notificationType: Type.string({maxlength: 256}),
      restaurantId: Type.string({maxlength: 256}) 
    },
);

export const Subscribe = clientsDB.model('Subscribe', SubscribeSchema)