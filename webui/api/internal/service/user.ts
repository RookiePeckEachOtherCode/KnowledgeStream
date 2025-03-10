import { Executor } from "../executor";
import { UserServiceRequest } from "../model/request/login";
import { UserServiceResponse } from "../model/response/login";

export class UserService {
  constructor(private executor: Executor) {}

  async login(
    req: UserServiceRequest["LOGIN"]
  ): Promise<UserServiceResponse["LOGIN"]> {
    const uri = `/user/login`;

    return (await this.executor({
      uri: uri,
      method: "POST",
      body: req,
    })) as UserServiceResponse["LOGIN"];
  }

  async register(
    req: UserServiceRequest["REGISTER"]
  ): Promise<UserServiceResponse["REGISTER"]> {
    const uri = `/user/register`;

    return (await this.executor({
      uri: uri,
      method: "POST",
      body: req,
    })) as UserServiceResponse["REGISTER"];
  }
}
