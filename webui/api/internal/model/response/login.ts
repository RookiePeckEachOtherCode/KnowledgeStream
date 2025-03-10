import { BaseResponse } from "../static/base-resp";

export type UserServiceResponse = {
  LOGIN: {
    base: BaseResponse;
    id: string;
    name: string;
    token: string;
  };
  REGISTER: {
    base: BaseResponse;
  };
};
