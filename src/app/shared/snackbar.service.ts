// src/app/core/services/snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'Close', duration: number = 3000, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: ['snackbar', `snackbar-${type}`],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
