import { SearchBarComponent } from './SearchBarComponent.js';
import { GenresGridComponent } from './GenresGridComponent.js';
import { SearchResultsComponent } from './SearchResultsComponent.js';

export class SearchComponent {
  static root = '._search_1nsw1_1';

  constructor(page) {
    this.page = page;
    this.root = this.page.locator(SearchComponent.root);

    this.bar = new SearchBarComponent(this.root, page);
    this.genres = new GenresGridComponent(this.root, page);
    this.results = new SearchResultsComponent(this.root, page);
  }
}