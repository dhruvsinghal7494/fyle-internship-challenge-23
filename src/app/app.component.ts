

import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { forkJoin, timeout } from 'rxjs';

interface Repository {
  name: string;
  description?: string;
  languages_url?: string;
  languages?: { [language: string]: number }; 
}

interface User {
  name: string;
  location?: string;
  bio?: string;
  twitter_username?: string;
  avatar_url?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fyle-frontend-challenge';
  username: string = '';
  details: User = {} as User;
  repositories: Repository[] = [];
  isLoading = false;
  currentPage = 1;
  perPage = 10;
  errorMessage?: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  searchUser() {
    this.isLoading = true;
    this.errorMessage = undefined; 
    this.repositories = []; 

    forkJoin([
      // setTimeout(() => this.apiService.getUserData(this.username), 2000), // Add timeout to simulate delay
      this.apiService.getUserData(this.username),
      this.apiService.getRepos(this.username, this.currentPage, this.perPage)
    ]).subscribe({
      next: ([user, repos]) => {
        this.isLoading = false;
        this.details = user;
        console.log('Fetched user details:', this.details);
        forkJoin(repos.map(repo => this.apiService.getRepoLanguages(this.username, repo.name)))
          .subscribe({
            next: languages => {
              this.repositories = repos.map((repo, index) => ({
                ...repo,
                languages: languages[index]
              }));
            },
            error: error => {
              console.error('Error fetching languages:', error);
            }
          });
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = `Error fetching user or repositories: ${error.message}`;
      }
    });
  }
  loadRepos(page: number) {
    this.isLoading = true;

    this.apiService.getRepos(this.username, page, this.perPage)
      .subscribe({
        next: data => {
          this.isLoading = false;
          this.repositories = data;
        },
        error: error => {
          this.isLoading = false;
          this.errorMessage = `Error fetching repositories: ${error.message}`;
        }
      });
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadRepos(pageNumber);
  }

  onPerPageChange(perPage: number) {
    this.perPage = perPage;
    this.loadRepos(this.currentPage);
  }
}
