export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
  }
  
  export enum TaskStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
  }