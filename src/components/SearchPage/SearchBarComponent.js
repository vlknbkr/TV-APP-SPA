import { BaseComponent } from '../BasePage/BaseComponent.js';

export class SearchBarComponent extends BaseComponent {
  static SELECTORS = {
    container: '._searchBar_1n1az_1',
    inputBox: '#search-input',
    input: 'input',
    clearBtn: '#search-input-clear'
  };

  constructor(root, page) {
    super(root, page);
  }

  container() { return this.root.locator(SearchBarComponent.SELECTORS.container); }
  inputBox() { return this.container().locator(SearchBarComponent.SELECTORS.inputBox); }
  input() { return this.inputBox().locator(SearchBarComponent.SELECTORS.input); }
  clearButton() { return this.container().locator(SearchBarComponent.SELECTORS.clearBtn); }
}