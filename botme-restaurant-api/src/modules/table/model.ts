import {createSchema, Type, typedModel} from 'ts-mongoose';
const TableSchema = createSchema(
    {
        tableId: Type.string({maxlength: 256, required: true, unique: true}),
        tableSeats: Type.number({required: true}),
        tableOccupied: Type.boolean({required: true}),
        area: Type.objectId({ref: "Area"})
    },
    {timestamps: {createdAt: true}}
);

export const Table = typedModel('Table', TableSchema);