import { Role, Scope } from "../entities/user/user";

export type Credentials = {
    email: string;
    password: string;
}

export type Claims = {
    id: string;
    email: string;
    scopes: Array<Scope>;
    role: Role;
}