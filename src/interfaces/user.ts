export interface IUser {
  nickname: string;
  email: string;
  password?: string;
  role: IUserRole;
}

export type IUserRole = 'admin' | 'client';
