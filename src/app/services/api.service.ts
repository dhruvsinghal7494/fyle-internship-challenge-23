import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 accessToken = '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'; 
  private readonly baseUrl = 'https://api.github.com';


  constructor(private httpClient: HttpClient) { } 

  getUserData(username: string): Observable<any> {
    const url = `${this.baseUrl}/users/${username}`;
    const headers = new HttpHeaders({ 'Authorization': `token ${this.accessToken}` }); 

    return this.httpClient.get(url, { headers })
      .pipe(
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
        map(response => response as any[]), 
        catchError(this.handleError)
      );
  }
  getRepoLanguages(username: string, repoName: string): Observable<any> {
    const url = `${this.baseUrl}/repos/${username}/${repoName}/languages`;
    return this.httpClient.get(url).pipe(
      map(response => response as any), 
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
