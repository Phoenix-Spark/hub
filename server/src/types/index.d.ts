export type Role = {
  id: number;
  users_id: number;
  roles: string;
};

export type Cell = {
  id: number;
  baseId: number;
  name: string;
  endpoint: string;
  externalWebsite: string;
  mission: string;
  contactNumbers: string[];
  email: string;
  logoUrl: string;
  isApproved: boolean;
};

export type Base = {
  id: number;
  name: string;
  lat: string;
  lng: string;
};

export type User = {
  id?: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  baseId: number;
  cellId: number;
  contactNumbers: string[];
  bio: string;
  base: string | undefined;
  cell: string | undefined;
  photo: string;
};

declare module 'express-session' {
  interface SessionData {
    user: User | null;
    roles: Role[] | null;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line no-shadow
    interface Request {
      user?: User;
    }
  }
}
