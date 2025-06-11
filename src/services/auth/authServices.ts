import { ILogin, ISession } from "../../types/global/IAuthTypes";
import { apiInstance } from "../../utils/config/apiConfig";

export const loginService = async (body: ILogin): Promise<ISession> => {
  const response = await apiInstance.post<ISession>("/auth/login", body);
  return response.data;
};

export const logoutService = async () => {
  const response = await apiInstance.post("/auth/logout");
  return response.data.error ? response.data : response.data;
};
