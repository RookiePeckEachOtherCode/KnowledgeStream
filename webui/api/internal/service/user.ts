import { Executor } from "../executor";
import { UserServiceRequest } from "../model/request/login";
import { UserServiceResponse } from "../model/response/login";

export class UserService {
  constructor(private executor: Executor) {}

  async login(
    req: UserServiceRequest["LOGIN"]
  ): Promise<UserServiceResponse["LOGIN"]> {
    const uri = `/user/login?name=${req.name}&phone=${req.phone}&password=${req.password}}`;

    return (await this.executor({
      uri: uri,
      method: "GET",
    })) as UserServiceResponse["LOGIN"];
  }
}
