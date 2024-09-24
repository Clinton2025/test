import { Model } from "sequelize-typescript";
export default class User extends Model {
    id: string;
    email: string;
    password: string;
}
