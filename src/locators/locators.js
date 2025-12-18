export const TITAN_OS_LOCATORS = {
    // GLOBAL
    MENU_ITEM: (name) => `[role="menuitem"][aria-label="${name}"]`,

    /**
     * NOTE:
     * `data-loading="true"` is used on individual components (e.g., buttons) too.
     * Use with care as a "global" readiness signal.
     */
    GLOBAL_LOADER: '[data-loading="true"]',

    // HOME PAGE
    LIST_SELECTOR: '[data-testid="lists-container"]',
    FAVORITE_APP: (name) => `[role="listitem"][data-testid="${name}"]`,
    LIST_ITEM_ROLE: 'div[role="listitem"]',
    LIST_ITEM_TESTID_PREFIX: '[data-testid^="list-item-"]',
    FAVOURITE_APPS_CONTAINER: '#favourite-apps',

    // APPS PAGE
    MINI_BANNER: '[data-testid="mini-banner"]',
    ADD_TO_FAVORITES_BUTTON: '#app-fav-button',
    FEATURED_APPS: "div[aria-label='Featured Apps']",

    // SEARCH PAGE
    SEARCH_INPUT: '#search-input',
    CATEGORY_LIST: '#search-genres',
    // Prefer scoping within the category list to avoid global aria-label collisions
    CATEGORY_CARD: (name) =>
        `#search-genres [role="listitem"][aria-label="${name}"], #search-genres [aria-label="${name}"]`,

    // CHANNELS PAGE
    CHANNELS_CONTAINER_READY: '#channel-info[data-content-ready="true"]',
    CHANNELS_ACTIVE_TITLE: '[data-testid="channels-switcher"][aria-label]',
    // Fixed: removed duplicate key + allow both focus value conventions
    CHANNELS_FOCUSED_ITEM:
        '[data-testid="channels-switcher"][data-focused="focused"], [data-testid="channels-switcher"][data-focused="true"]',
};
