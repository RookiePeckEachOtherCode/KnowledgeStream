import { BaseResponse } from "../static/base-resp";

export type UserServiceResponse = {
  LOGIN: {
    base: BaseResponse;
    id: string;
    token: string;
  };
};
