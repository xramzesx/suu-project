type NewUser = {
  username: string;
  email: string;
  password: string;
  description?: string;
};

type ReturnUser = {
  userId: number;
  email: string;
  username: string;
  description: string | null;
  gender: string | null;
  height: number | null;
};

type UserDetails = {
  userId: number;
  username: string;
  description: string | null;
};

type NewUserDetails = {
  username: string;
  email: string;
  description: string | null;
};

type BaseUser = {
  userId: number;
  username: string;
};

export type { NewUser, ReturnUser, UserDetails, BaseUser, NewUserDetails };
