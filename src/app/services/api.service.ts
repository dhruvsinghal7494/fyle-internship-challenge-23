import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'https://api.github.com';

  constructor(private httpClient: HttpClient) { }

  getUserDetails(username: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/users/${username}`).pipe(
      map(response => response as any),
      catchError(this.handleError)
    );
  }

  getRepos(username: string, page: number = 1, perPage: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage));

    return this.httpClient.get(`${this.baseUrl}/users/${username}/repos`, { params })
      .pipe(
        map(response => response as any[]), // Type cast response to array of repositories
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
