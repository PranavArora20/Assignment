# User Directory Table
A simple React app that fetches and displays users from the ReqRes API in a table with search, sort, pagination, and basic filters. Built to be minimal and easy to review.

### Objective :
Build a React web page that fetches and displays user data from:

### API : https://reqres.in/api/users

## Deployed link : [Link](https://assignment-one-umber.vercel.app/)

Features

- Table view of users with avatar, name, and email.

- Search by name or email.

- Sort by first name or email.

- Pagination via API pages (?page, ?per_page).

Filters:

- Email domain filter.

- First-letter filter (first name).

Bonus:

- Loading spinner while fetching.

- Mobile-responsive layout.

- Deployed to Vercel.

### Tech stack :

React (Vite)

JavaScript

Fetch API

Minimal CSS

Optional Material UI for icons/inputs

Project structure
src/api/reqres.js — tiny wrapper for https://reqres.in/api/users with page/per_page.

src/components/UserTable.jsx — table with search, sort, pagination, filters, and loading state.

src/App.jsx — renders the table in a simple layout.

src/main.jsx — app entry.

src/app.css — small, responsive styles.

How it works
Pagination: Requests the desired page and per_page from the ReqRes endpoint and uses total_pages to render pagination controls.

Search: Client-side filtering over first name, last name, and email for the current page.

Sort: Client-side asc/desc sort by first_name or email for the current page.

Filters: Email domain dropdown generated from the current page, plus a first-letter filter.

UX: Shows a spinner while loading and a friendly “No results” when filters/search exclude all rows.