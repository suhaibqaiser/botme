import {createSchema, Type, typedModel} from 'ts-mongoose';
const AreaSchema = createSchema(
    {
        areaId: Type.string({maxlength: 256, required: true, unique: true}),
        areaName: Type.string({maxlength: 256, required: true, unique: true}),
        areaActive: Type.boolean({required: true}),
        restaurant : Type.objectId({ref: "Restaurant"}),
        tables : [Type.objectId({ref: "Table"})]
    },
    {timestamps: {createdAt: true}}
);

export const Area = typedModel('Area', AreaSchema);