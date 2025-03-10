export type UserServiceRequest = {
  LOGIN: {
    phone: string;
    password: string;
  };
  REGISTER: {
    name: string;
    phone: string;
    password: string;
  };
};
