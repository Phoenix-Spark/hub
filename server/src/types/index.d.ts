import RedisStore from 'connect-redis';
import {
  IBaseRepository,
  ICellRepository,
  INewsRepository,
  IProjectRepository,
  IUserRepository,
} from './IRepository.js';

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

export type CellFromDb = Cell & {
  contactNumber1?: string;
  contactNumber2?: string;
};

export type CellWithBadKeys = Cell & {
  base_id?: number;
  contact_number1?: string;
  contact_number2?: string;
  external_website?: string;
  logo_url?: string;
  is_approved?: boolean;
};

export type Base = {
  id: number;
  name: string;
  lat: string;
  lng: string;
};

export type CellWithBase = Cell & Base;
export type CellFromDbWithBase = CellFromDb & Base;

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
  base?: Base;
  cell?: Cell;
  photoUrl: string;
};

export type UserFromDb = User & {
  contactNumber1?: string;
  contactNumber2?: string;
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

export type CellDetails = {
  cell: Cell;
  team: User[];
  currentProjects: Project[];
  previousProjects: Project[];
  base: Pick<Base, 'id' | 'name'>;
};

export interface ContactNumberArray {
  contactNumber1?: string;
  contactNumber2?: string;
  contactNumbers?: string[];
  contact_number1?: string;
  contact_number2?: string;
}

export declare type Components = {
  newsRepository: INewsRepository;
  cellRepository: ICellRepository;
  userRepository: IUserRepository;
  projectRepository: IProjectRepository;
  baseRepository: IBaseRepository;
  redisStore: RedisStore;
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
