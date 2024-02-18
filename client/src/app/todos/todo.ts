export interface Todo {

  _id: string;
  owner: string;
  body: string;
  status: boolean;
  category: string;
  avatar?: string;


}
export type UserRole = 'admin' | 'editor' | 'viewer';

