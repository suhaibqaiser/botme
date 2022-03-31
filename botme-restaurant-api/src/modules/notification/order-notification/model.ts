import {createSchema, Type, typedModel} from 'ts-mongoose';
import {clientsDB} from '../../../config/mongoDB';

const SubscribeSchema = createSchema(
    {
      subscription:{
        endpoint: Type.string({maxlength: 256, required: true}),
        expirationTime: Type.string(),
        keys: {
          p256dh: Type.string({maxlength: 256, required: true}),
          auth: Type.string({maxlength: 256, required: true})
        },
      },
      notificationType: Type.string({maxlength: 256}) 
    },
);

export const Subscribe = clientsDB.model('Subscribe', SubscribeSchema)