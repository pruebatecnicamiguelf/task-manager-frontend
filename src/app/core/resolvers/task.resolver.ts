import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export const taskResolver: ResolveFn<Observable<Task[]>> = (route) => {
  const taskService = inject(TaskService);
  const taskId = route.paramMap.get('id');
  return taskService.getTasks();
};
