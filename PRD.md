# Product Requirements Document (PRD)

## Overview

This document details the implementation of a search page with dynamic loading of results using React Router 7. The application consists of a main layout, a search page, and a nested route for displaying search results.

---

## Features

1. **Main Layout**

   - Provides a consistent header, navigation, and footer across all pages.
   - Contains links to the Home, About, and Search pages.

2. **Search Functionality**

   - Dynamically loads search results based on user input.
   - Simulates an API call with a hardcoded data set.
   - Displays a loading spinner during search execution.
   - Supports nested routes for detailed search result pages.

3. **Routing Configuration**

   - Implements modern React Router patterns with loaders and nested routes.
   - Ensures type safety and dynamic navigation.

4. **Search Form**
   - Uses React Router's `Form` component for structured and accessible form handling.
   - Submits the form data seamlessly via loader and action functions.

---

## File Structure

```
src/
├── layout/
│   └── main.tsx
├── routes/
│   ├── home.tsx
│   ├── about.tsx
│   └── search/
│       ├── index.tsx
│       └── list.tsx
├── data/
│   └── searchData.ts
├── routes.ts
```

---

## Implementation

### **1. Main Layout (`layout/main.tsx`):**

Provides shared layout components.

```tsx
import { Outlet, Link } from "react-router";

const MainLayout = () => {
  return (
    <div>
      <header>
        <h1>App Title</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
          <Link to="/search">Search</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2024 My App</p>
      </footer>
    </div>
  );
};

export default MainLayout;
```

### **2. Home Page (`routes/home.tsx`):**

The main landing page.

```tsx
const Home = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to our app!</p>
    </div>
  );
};

export default Home;
```

### **3. About Page (`routes/about.tsx`):**

Static about page.

```tsx
const About = () => {
  return (
    <div>
      <h2>About</h2>
      <p>Learn more about us here!</p>
    </div>
  );
};

export default About;
```

### **4. Search Page (`routes/search/index.tsx`):**

Main search page with a loader and search functionality.

```tsx
import * as Route from "./+types.search";
import { Form, NavLink, Outlet, useNavigation, useSubmit } from "react-router";
import { useEffect } from "react";
import { getSearchResults } from "~/data/searchData";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const searchResults = await getSearchResults(q);
  return { searchResults, q };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const query = formData.get("q");
  const searchResults = await getSearchResults(query?.toString() || "");
  return { searchResults, q: query };
};

export default function Search({ loaderData }: Route.ComponentProps) {
  const { searchResults, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>Search Page</h1>
        <div>
          <Form
            id="search-form"
            role="search"
            method="post"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              id="q"
              aria-label="Search items"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q || ""}
              className={searching ? "loading" : ""}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
          </Form>
        </div>
        <nav>
          {searchResults.length ? (
            <ul>
              {searchResults.map((item) => (
                <li key={item.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`list/${item.id}`}
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No results found</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}
```

### **5. Search Result Details (`routes/search/list.tsx`):**

Subroute for displaying details of a selected search result.

```tsx
import { useParams } from "react-router";

export default function SearchResultDetail() {
  const { id } = useParams();

  return (
    <div>
      <h2>Search Result Detail</h2>
      <p>Details for item ID: {id}</p>
    </div>
  );
}
```

### **6. Search Data (`data/searchData.ts`):**

Mocked data for simulating search results.

```tsx
export const getSearchResults = async (query: string | null) => {
  const data = [
    { id: 1, title: "Result 1", description: "Description 1" },
    { id: 2, title: "Result 2", description: "Description 2" },
    { id: 3, title: "Result 3", description: "Description 3" },
  ];
  if (!query) return data;
  return data.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
};
```

### **7. Routes Configuration (`routes.ts`):**

Defines the routing structure.

```tsx
import { layout, route, type RouteConfig } from "@react-router/dev/routes";
import {
  loader as searchLoader,
  action as searchAction,
} from "./routes/search/index";

export const routes: RouteConfig = [
  layout("layout/main.tsx", [
    route("home", "routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("search", "routes/search/index.tsx", {
      loader: searchLoader,
      action: searchAction,
      children: [route("list/:id", "routes/search/list.tsx")],
    }),
  ]),
];
```
