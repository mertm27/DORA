export interface ILogin {
  username: string;
  password: string;
}

export interface ISession {
  accessToken: string;
  refreshToken: string;
}
