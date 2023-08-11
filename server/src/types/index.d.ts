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

export type Faq = {
  id: number;
  question: string;
  answer: string;
  askedBy: number;
  answeredBy: number;
};

export type Project = {
  id: number;
  cellId: number;
  proposedBy: number;
  dateProposed: Date;
  isApproved: boolean;
  dateApproved: Date;
  isComplete: boolean;
  dateComplete: Date;
  name: string;
  description: string;
  budget: string;
  asksTasks: string;
  comments: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type NewsStory = {
  id: number;
  title: string;
  date: Date;
  cellId: number;
};

export type Post = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  body: string;
  createTime: Date;
  isEdited: boolean;
  editTime: Date;
  views: number;
};

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createTime: Date;
  isEdited: boolean;
  editTime: Date;
};

export type Reply = {
  id: number;
  commentId: number;
  userId: number;
  body: string;
  createTime: Date;
  isEdited: boolean;
  editTime: Date;
};

export type ProjectPhoto = {
  url: string;
  index: number;
  name: string;
  description: string;
};

export type ProjectTag = {
  id: number;
  name: string;
};

export type CellAndBase = Cell & Base;

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
