export type User = {
    id: number;
    email: string;
    passwordHash: string;
    username?: string;
    address?: string;
    phone?: string;
};

export type Login = {
    email: string;
    password: string;
};

export type Response = {
    token: string;
    user: User;
};
