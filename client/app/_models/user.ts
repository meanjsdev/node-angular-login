export class User {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
    oldPassword?: string;
    newPassword?: string;
}