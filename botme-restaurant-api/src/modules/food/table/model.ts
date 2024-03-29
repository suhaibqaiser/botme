import {createSchema, Type, typedModel} from 'ts-mongoose';
import {foodDB} from "../../../config/mongoDB";
const TableSchema = createSchema(
    {
        tableId: Type.string({maxlength: 256, required: true, unique: true}),
        tableLabel: Type.number({unique: true}),
        tableSeats: Type.number({required: true, sparse: true}),
        tableOccupied: Type.boolean({required: true}),
        areaId: Type.string({maxlength: 256, required: true})
    },
    {timestamps: {createdAt: true}}
);

export const Table = foodDB.model('Table', TableSchema);
