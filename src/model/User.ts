import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ timestamps: true, tableName: 'user', })
export default class User extends Model {

    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Column(DataType.STRING)
    id!: string;

    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    password!: string;
}