// src/app/dashboard/task-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/core/models/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

interface TaskDialogData {
  task?: Task;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['PENDING', Validators.required],
    });

    if (data?.task) {
      this.isEditMode = true;
      this.taskForm.patchValue(data.task);
    }
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      if (this.isEditMode && this.data.task?.id) {
        this.taskService.updateTask(this.data.task?.id, taskData).subscribe(
          (response) => {
            this.snackbarService.show(
              'Task updated successfully',
              'success'
            );
            this.dialogRef.close(true);
          },
          (error) => {
            this.snackbarService.show('Failed to update task', 'error');
          }
        );
      } else {
        this.taskService.createTask(taskData).subscribe(
          (response) => {
            this.snackbarService.show(
              'Task created successfully',
              'success'
            );
            this.dialogRef.close(true);
          },
          (error) => {
            this.snackbarService.show('Failed to create task', 'error');
          }
        );
      }
    }
  }
}
