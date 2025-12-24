// src/components/SearchComponent.js
import { SearchBarComponent } from './SearchBarComponent.js';
import { GenresGridComponent } from './GenresGridComponent.js';
import { SearchResultsComponent } from './SearchResultsComponent.js';

export class SearchComponent {
  constructor(page) {
    this.page = page;
    this.bar = new SearchBarComponent(page);
    this.genres = new GenresGridComponent(page);
    this.results = new SearchResultsComponent(page);
  }
}