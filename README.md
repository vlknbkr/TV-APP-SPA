# TitanOS TV SPA – Playwright Automation (JavaScript)

**Author:** Volkan Bakar

Automation project for `app.titanos.tv` (TV-style SPA) using Playwright + JavaScript with a Page Object Model (POM) designed for remote-control navigation (Arrow keys + OK/Enter) and virtual focus validation.


## Installation

### Prerequisites

-   Node.js 18+ recommended
-   npm

### Setup

```bash
npm install
npx playwright install
```

### Environment variables

Create/adjust `.env`:

```bash
BASE_URL=https://app.titanos.tv/
```

## Running tests

**Run all tests**
```bash
npm test
```

**Headed mode** (visualize the browser)
```bash
npm run test:headed
```

**Debug mode** (step-by-step execution)
```bash
npm run test:debug
```

**Show HTML report**
```bash
npm run report
```

## Project structure

Generated artifacts should be ignored: `node_modules/`, `playwright-report/`, `test-results/`, etc.

**Typical structure:**

titanOS-task/
├─ src/
│  ├─ pages/                  # Page Objects (flows, orchestration)
│  │  ├─ BasePage.js
│  │  ├─ AppsPage.js
│  │  ├─ HomePage.js
│  │  ├─ SearchPage.js
│  │  └─ ChannelsPage.js
│  ├─ components/             # UI Components (locators + small behaviors)
│  │  ├─ AppPage/
│  │  │  ├─ AppItemComponent.js
│  │  │  ├─ CategoryAppItemComponent.js
│  │  │  ├─ CategoryListComponent.js
│  │  │  └─ MiniBannerComponent.js
│  │  ├─ BasePage/
│  │  │  └─ BaseComponent.js
│  │  ├─ ChannelsPage/
│  │  │  ├─ ChannelInfoComponent.js
│  │  │  ├─ ChannelsMenuComponent.js
│  │  │  └─ ChannelsOverlayComponent.js
│  │  ├─ HomePage/
│  │  │  ├─ FavAppItemComponent.js
│  │  │  └─ FavAppListComponent.js
│  │  └─ SearchPage/
│  │     ├─ GenresGridComponent.js
│  │     ├─ SearchBarComponent.js
│  │     ├─ SearchComponent.js
│  │     └─ SearchResultsComponent.js
│  ├─ fixtures/
│  │  └─ fixtures.js           # test fixtures (page objects wiring)
│  └─ utils/
│     └─ RemoteControl.js      # Arrow keys + OK + Long OK simulation
├─ tests/
│  ├─ add-favorite.spec.js
│  ├─ delete-favorite.spec.js
│  ├─ search.spec.js
│  └─ channel.spec.js
├─ playwright.config.js
├─ package.json
└─ README.md
```

## POM architecture

### Responsibilities

**Pages (`src/pages/`)**
-   Own user flows (navigation, “open page”, “remove favorite”, “switch channel”, etc.).
-   Call `RemoteControl` actions (Arrow/OK/Long OK).
-   Compose multiple Components to perform full scenarios.
-   Provide assertion helpers for outcomes (e.g., “channel changed”, “results resolved”, “item removed”).

**Components (`src/components/`)**
-   Own scoped locators and small UI behaviors.
-   Do not navigate the app.
-   Keep selectors close to where they’re used 

**Fixtures (`src/fixtures/`)**
-   Create and expose page objects: `{ homePage, appsPage, searchPage, channelsPage }`
-   Provide consistent setup (base URL, storage state if needed, etc.)
-   Keep tests clean: tests call page flows, not raw selectors.

**RemoteControl (`src/utils/RemoteControl.js`)**
-   Single abstraction for:
    -   `up`/`down`/`left`/`right`
    -   `select()` (OK)
    -   `longSelect(ms)` (press & hold)
-   Central place for logging (useful for debugging flakiness).

## Focus strategy (TV SPA)

This UI is not mouse/keyboard-first. “Selection” is driven by **virtual focus**.

### Single source of truth
-   Focus is encoded via attributes like:
    -   `data-focused="focused"` (most common)
    -   sometimes false is encoded as `data-focused="false"`

### How we validate focus (best practice)
-   Prefer attribute-based focus assertions instead of visibility-only:
    ```javascript
    await expect(tile).toHaveAttribute('data-focused', 'focused');
    ```
-   When focus moves asynchronously, prefer polling:
    ```javascript
    await expect.poll(() => locator.getAttribute('data-focused')).toBe('focused');
    ```

## Waiting for readiness

Some lists expose readiness signals (example):
-   `data-content-ready="true"`

Use it before interacting with grid/list content to prevent flakiness.

---

## Reporting
-   Uses Playwright HTML report:
    ```bash
    npm run report
    ```

## Test cases (what we actually validate)

### 1) Favorites – Add to Favorites

**Intent:** prove that a user can add a non-favorite app to the favorites list.

**Validations should include:**
-   App is NOT in favorites (precondition)
-   Navigate to Apps Page
-   Focus specific App
-   Press "Add to Favorites"
-   Outcome: App appears in the Favorites list on Home Page

### 2) Favorites – Remove from Favorites

**Intent:** prove that a user can remove a non-protected favorite app.

**Validations should include:**
-   App is added to favorites (precondition)
-   Focus app in Favorites list
-   Press "Remove from Favorites" (Long Press / Menu)
-   Outcome: App tile no longer exists in favorites list

### 3) Search – Verify we can open a category from Search page

**Intent:** prove genre navigation triggers a real UI transition.

**Validations should include:**
-   Search input is present (smoke)
-   Genres grid is visible
-   Select a genre (remote OK)
-   Outcome: results area changes:
    -   tabs/grid become visible OR
    -   empty state is visible with correct structure OR
    -   `aria-label` on results grid reflects the selected filter

### 4) Channels – Verify channels page is available to us

**Intent:** prove overlay works and channels can be changed.

**Validations should include:**
-   Channels overlay exists 
-   Current channel label captured
-   Switch channel up/down N steps
-   Outcome: channel label changes (not just “visible”)
-   (Optional) open the channels menu and validate menu items exist & are actionable