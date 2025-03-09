import type { Executor } from "./executor";
import { UserService } from "./service/user";

export class Api {
  readonly userService: UserService;
  constructor(executor: Executor) {
    this.userService = new UserService(executor);
  }
}
