import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    password: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    name: string;
  }
}
