export const TITAN_OS_LOCATORS = {

    // GLOBAL
    MENU_ITEM: (name) =>
        `[role="menuitem"][aria-label="${name}"]`,
    GLOBAL_LOADER: '[data-loading="true"]',

    // HOME PAGE
    LIST_SELECTOR: 
        '[data-testid="lists-container"]',
    FAVORITE_APP: 
        (name) => `[role="listitem"][data-testid="${name}"]`,
    LIST_ITEM_ROLE: 
        'div[role="listitem"]',
    LIST_ITEM_TESTID_PREFIX: 
        '[data-testid^="list-item-"]',
    FAVOURITE_APPS_CONTAINER: 
        '[id="favourite-apps"]',

    // APPS PAGE
    MINI_BANNER: '[data-testid="mini-banner"]',
    ADD_TO_FAVORITES_BUTTON: '[id="app-fav-button"]',
    FEATURED_APPS: "div[aria-label='Featured Apps']",

    // SEARCH PAGE
    SEARCH_INPUT: '[id="search-input"]',
    CATEGORY_LIST: '[id="search-genres"]',
    CATEGORY_CARD: 
        (name) => `[aria-label="${name}"] > div`,

    // CHANNELS PAGE
    CHANNELS_CONTAINER_READY:
        '#channel-info[data-content-ready="true"]',
    CHANNELS_ACTIVE_TITLE:
        '[data-testid="channels-switcher"][aria-label]',
    CHANNELS_FOCUSED_ITEM:
        '[data-testid="channels-switcher"][data-focused="focused"]',
    CHANNELS_FOCUSED_ITEM:
        '[data-testid="channels-switcher"][data-focused="focused"]',
    CHANNELS_CONTAINER_READY:
        '#channel-info[data-content-ready="true"]'


}

