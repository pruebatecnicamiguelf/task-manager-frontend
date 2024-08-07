import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ token: string }>(url, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem(this.TOKEN_KEY, response.data.jwtToken);
      }),
      catchError(this.handleError)
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/register`;
    const body = { username, email, password };
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {}).pipe(catchError(this.handleError));
  }

  handleLogoutSuccess() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
