// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { SnackbarService } from '../shared/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './dialog/task-dialog.component';
import { Task, TaskStatus } from '../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private taskService: TaskService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.tasks = data.tasks.data;
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: any) => {
      this.tasks = tasks?.data;
    });
  }

  completeTask(task: Task) {
    const updatedTask = { ...task, status: TaskStatus.COMPLETED };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.snackbarService.show('Task marked as completed', 'success');
        this.loadTasks();
      },
      error: () => {
        this.snackbarService.show('Failed to update task', 'error');
      },
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.snackbarService.show('Task deleted successfully', 'success');
        this.loadTasks();
      },
      error: () => {
        this.snackbarService.show('Failed to delete task', 'error');
      },
    });
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { task, isEditMode: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  toggleTaskStatus(task: Task) {
    const updatedStatus =
      task.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    const updatedTask = { ...task, status: updatedStatus };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        const message =
          updatedStatus === TaskStatus.COMPLETED
            ? 'Task marked as completed'
            : 'Task marked as pending';
        this.snackbarService.show(message, 'success');

        const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
        }
      },
      error: () => {
        this.snackbarService.show('Failed to update task', 'error');
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe((res) => {
      console.log(res);
    });
    this.router.navigate(['/login']);
  }
}
