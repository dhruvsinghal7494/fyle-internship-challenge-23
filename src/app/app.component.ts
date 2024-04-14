// import { Component, OnInit } from '@angular/core';
// import { ApiService } from './services/api.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit{
//   title = 'fyle-frontend-challenge';
//   GetRepos: any;
//   constructor(
//     private apiService: ApiService
//   ) {}

//   ngOnInit() {
//     this.apiService.getUser('johnpapa').subscribe(console.log);
//   }
//   private loadRepos() {
//     this.apiService.getRepos('johnpapa').subscribe({
//       next: (data:any) => {
//         this.GetRepos = data;
//         console.log('Fetched repositories:', this.GetRepos);
//     },
//     error: (error:any) => {
//       console.log(error);
//     }
//     });
    
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { forkJoin } from 'rxjs';

interface Repository {
  name: string;
  description?: string; 
  
  // ... other properties
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
  username: string='';
  details: User= {} as User;
  repositories: Repository[] = [];
  isLoading = false;
  currentPage = 1;
  perPage = 10;
  errorMessage?: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  // searchUser() {
  //   this.isLoading = true;
  //   this.errorMessage = undefined; // Clear any previous error messages
  //   this.repositories = []; // Clear previous repositories

  //   this.apiService.getUserDetails(this.username)
  //     .subscribe({
  //       next: () => this.loadRepos(this.currentPage), // Load repositories after successful user fetch
  //       error: error => {
  //         this.isLoading = false;
  //         this.errorMessage = `Error fetching user: ${error.message}`;
  //       }
  //     });
  // }
 
  searchUser() {
    this.isLoading = true;
    this.errorMessage = undefined; // Clear any previous error messages
    this.repositories = []; // Clear previous repositories

    forkJoin([
      this.apiService.getUserDetails(this.username),
      this.apiService.getRepos(this.username, this.currentPage, this.perPage)
    ]).subscribe({
      next: ([user, repos]) => {
        this.isLoading = false;
        this.details = user;
        this.repositories = repos;
        console.log('Fetched user details:', this.details);
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
