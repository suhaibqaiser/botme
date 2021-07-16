import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../config/mongoDB";
const TableSchema = createSchema(
    {
        tableId: Type.string({maxlength: 256, required: true, unique: true}),
        tableSeats: Type.number({required: true, sparse: true}),
        tableOccupied: Type.boolean({required: true}),
        area: Type.objectId({ref: "Area"})
    },
    {timestamps: {createdAt: true}}
);

export const Table = foodDB.model('Table', TableSchema);