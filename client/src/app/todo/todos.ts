export interface Todos {
  _id: string;
  name: string;
  age: number;
  company: string;
  email: string;
  avatar?: string;
  role: TodosRole;
}

export type TodosRole = 'admin' | 'editor' | 'viewer';
