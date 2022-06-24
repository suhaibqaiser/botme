import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from '../../../config/mongoDB';

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
      clientId: Type.string({maxlength: 256}) 
    },
);

export const Subscription = foodDB.model('Subscribe', SubscribeSchema)