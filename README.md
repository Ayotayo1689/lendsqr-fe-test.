# Lendsqr Frontend Engineering Test

A responsive React, TypeScript, and SCSS implementation of the Lendsqr admin console assessment.

The app includes the required Login, Dashboard, Users, and User Details pages, backed by a deterministic 500-record mock API. It also handles real application states such as loading, empty results, errors, filtering, pagination, persisted user status changes, protected routes, and confirmation flows.

## Tech Stack

- React 18
- TypeScript
- SCSS
- Vite
- React Router DOM
- Vitest
- React Testing Library
- LocalStorage for persistence

## Pages And Routes

| Route | Page | Description |
| --- | --- | --- |
| `/login` | Login | Login form with password visibility toggle and loading/error handling |
| `/dashboard` | Dashboard | Summary metrics from the full persisted user dataset |
| `/users` | Users | User stat cards, paginated table, filters, row actions, loading/empty/error states |
| `/users/:id` | User Details | Full user profile with status-aware actions and persisted details |

The root route redirects authenticated users to `/users`. Protected routes redirect unauthenticated users to `/login`.

## Core Features

### Authentication

Authentication is handled in `src/context/AuthContext.tsx`.

The login flow validates that:

- the email contains `@`
- the password has at least 6 characters

Successful login is persisted in localStorage with the `lendsqr-authenticated` key.

### Users Data

The mock user data is generated in `src/data/users.ts`.

The generator creates 500 deterministic records with fields derived from the Figma design:

- organization
- username
- email
- phone number
- date joined
- status
- tier
- account balance
- bank details
- personal information
- education and employment
- socials
- guarantors
- loan and savings flags

The mock API lives in `src/services/mockApi.ts`.

It simulates async API calls with small delays and exposes:

- `getUsers`
- `getUser`
- `updateUserStatus`
- `getDashboardStats`

### Persistence

User data is persisted in localStorage under the `lendsqr-users` key.

On first load, the app seeds localStorage with the generated 500 records. After that, status changes are written back to the persisted dataset, so actions survive reloads and stay consistent across the Users page, Dashboard page, and User Details page.

Viewed user details are also cached in localStorage under `lendsqr-user-cache`.

### State Management

Shared user state is handled in `src/context/UsersContext.tsx`.

It manages:

- current page of users
- filtered result total
- global full-dataset stats
- pagination state
- filter state
- loading state
- error state
- cached user details
- persisted status updates

The Users page intentionally separates:

- `total`: the filtered result count used by pagination
- `stats`: full-dataset metrics used by the stat cards

This prevents dashboard cards from accidentally showing counts from only the current paginated page.

### Users Table

Implemented in `src/components/UsersTable.tsx`.

Features:

- paginated table rendering
- filter popover
- click-outside-to-close behavior for filter and action menus
- row click navigation to user details
- keyboard navigation with Enter/Space
- MoreVertical action menu
- confirmation modal before status changes
- status-aware available actions

Status action rules:

| Current Status | Available Actions |
| --- | --- |
| Pending | Activate, Blacklist |
| Inactive | Activate, Blacklist |
| Blacklisted | Activate |
| Active | Deactivate, Blacklist |

### User Details

Implemented in `src/pages/UserDetails.tsx`.

The page shows:

- profile summary
- user tier
- account balance
- tab navigation UI
- personal information
- education and employment
- socials
- guarantors

It uses the same status-aware action rules as the users table and persists updates through the shared users context.

### Loading, Empty, And Error States

State components are in `src/components/StateViews.tsx`.

The app includes:

- table-shaped skeleton loading state for the Users page
- profile/details-shaped skeleton loading state for the User Details page
- generic skeleton loading state for Dashboard
- empty state for filters with no results
- retryable error state

### Responsive Design

Styles are in `src/styles/main.scss`.

The app is responsive across desktop, tablet, and mobile:

- desktop uses a fixed sidebar and top navigation
- tablet/mobile turns the sidebar into a drawer
- user stat cards collapse from four columns to two and then one
- the users table becomes stacked mobile-friendly rows
- details grids collapse gracefully on smaller screens

## Project Structure

```text
src/
  assets/
    illustration.svg
    login-illustration.png
    logo.svg
    userimage.png
  components/
    AppLayout.tsx
    ConfirmModal.tsx
    Logo.tsx
    Pagination.tsx
    StateViews.tsx
    StatCard.tsx
    StatusBadge.tsx
    UsersTable.tsx
    icons.tsx
  context/
    AuthContext.tsx
    UsersContext.tsx
  data/
    users.ts
    users.test.ts
  pages/
    Dashboard.tsx
    Login.tsx
    UserDetails.tsx
    Users.tsx
  services/
    mockApi.ts
    mockApi.test.ts
  styles/
    main.scss
  test/
    setup.ts
  App.tsx
  App.test.tsx
  main.tsx
  types.ts
  vite-env.d.ts
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Testing

Tests are written with Vitest and React Testing Library.

Current coverage includes:

- deterministic generation of 500 user records
- presence of user details fields required by the UI
- API pagination behavior
- API filtering behavior, including empty results
- protected routing
- login-to-users flow

Run:

```bash
npm run test
```

## Design And Implementation Decisions

### Pagination Instead Of Virtualization

The assessment requires handling 500 records. Pagination is used because each render only displays a small page of rows, which keeps the UI responsive without adding the complexity of virtualization.

Virtualization would be reasonable for thousands of visible rows or infinite scrolling, but for a fixed 500-record admin table with pagination, it would be extra complexity without much user benefit.

### LocalStorage Persistence

LocalStorage was chosen because the assessment allows localStorage or IndexedDB. The data shape is small enough for localStorage, and it keeps the mock API easy to inspect and explain.

### Self-Contained Mock API

The app does not depend on a third-party mock endpoint. This keeps the submission stable for reviewers and makes it possible to run, test, and build without relying on an external service.

### Status-Aware Actions

Both the users table and the user details page prevent invalid actions from being shown. For example, a blacklisted user can only be activated, and an active user can be deactivated or blacklisted.

## Accessibility Notes

- Semantic buttons are used for actions.
- Table rows support keyboard navigation.
- Modals use `role="dialog"` and `aria-modal`.
- Loading states use `role="status"` and `aria-live`.
- Error states use `role="alert"`.
- Icon buttons include accessible labels.

## Known Notes

The custom SVG icon file contains some SVG attributes copied from raw SVG output. React may warn in tests about attributes like `stroke-width` or `clip-path`; these warnings do not affect the production build, but they can be cleaned by converting them to JSX casing such as `strokeWidth` and `clipPath`.

## Verification

The latest implementation was verified with:

```bash
npm.cmd run test
npm.cmd run build
```

Both commands pass.
