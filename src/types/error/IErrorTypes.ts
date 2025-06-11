export interface IErrorResponse {
  status: number;
  error: string;
  message: string;
}

export interface IApiResponse<T> {
  data: T;
  error?: IErrorResponse;
}

export interface IErrorResponseObject {
  response: {
    data: {
      message: string;
    };
  };
}
