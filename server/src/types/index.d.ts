export type Role = {
  id: number;
  users_id: number;
  roles: string;
};

export type Cell = {
  id: number;
  baseId: number;
  base_id?: number;
  name: string;
  endpoint: string;
  externalWebsite: string;
  external_website?: string;
  mission: string;
  contact_number1?: string;
  contact_number2?: string;
  contactNumbers: string[];
  email: string;
  logoUrl: string;
  logo_url?: string;
  isApproved: boolean;
  is_approved?: boolean;
};

export type Base = {
  id: number;
  name: string;
  lat: string;
  lng: string;
};

export type CellWithBase = Cell & Base;

export type User = {
  id?: number;
  username: string;
  password?: string;
  firstName: string;
  // first_name?: string;
  lastName: string;
  // last_name?: string;
  email: string;
  baseId: number;
  // base_id?: number;
  cellId: number;
  // cell_id?: number;
  // contact_number1?: string;
  // contact_number2?: string;
  contactNumbers: string[];
  bio: string;
  base?: string;
  cell?: string;
  photo: string;
  // photo_url: string;
};

export type DbUser = {
  first_name: string;
  last_name?: string;
  base_id?: number;
  cell_id?: number;
  contact_number1?: string;
  contact_number2?: string;
  photo_url: string;
};

export type UserWithBaseAndCellName = User & {
  cellName: string;
  baseName: string;
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
  cell_id?: number;
  proposedBy: number;
  proposed_by?: number;
  dateProposed: Date;
  date_proposed?: Date;
  isApproved: boolean;
  is_approved?: boolean;
  dateApproved: Date;
  date_approved?: Date;
  isComplete: boolean;
  is_complete?: boolean;
  dateComplete: Date;
  date_complete?: Date;
  name: string;
  description: string;
  budget: string;
  asksTasks: string;
  asks_tasks?: string;
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
  cell_id?: number;
};

export type Post = {
  id: number;
  userId: number;
  user_id?: number;
  categoryId: number;
  category_id?: number;
  title: string;
  body: string;
  createTime: Date;
  create_time?: Date;
  isEdited: boolean;
  is_edited?: boolean;
  editTime: Date;
  edit_time?: Date;
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

export type CellAndBase = {
  cell: Cell;
  base: Base;
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
