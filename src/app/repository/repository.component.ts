import { Component, Input } from '@angular/core';

interface Repository {
  name: string;
  description?: string;
  languages?: { [key: string]: string };
}

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent {
  // @Input() repo: Repository;
}
