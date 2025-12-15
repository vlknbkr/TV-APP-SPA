export const TITAN_OS_LOCATORS = {
    LIST_SELECTOR: '[data-testid="lists-container"]',
    ADD_TO_FAVORITES_BUTTON: '[id="app-fav-button"]',
    FEATURED_APPS: "div[aria-label='Featured Apps']",
    HOME_MENU_ITEM: '[role="menuitem"][aria-label="Home"][aria-selected]',
    FAVOURITE_APPS_CONTAINER: '[id="favourite-apps"]',
    FAVORITE_APP: (name) => `[role="listitem"][data-testid="${name}"]`,
    LIST_ITEM_ROLE: 'div[role="listitem"]',
    LIST_ITEM_TESTID_PREFIX: '[data-testid^="list-item-"]',
    SEARCH_INPUT: '[id="search-input"]',
    CATEGORY_LIST: '[id="search-genres"]',
    CATEGORY_CARD: (name) => `[aria-label="${name}"] > div`
}
