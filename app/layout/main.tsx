import { Link, Outlet } from "react-router";

export default function App() {
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
}
