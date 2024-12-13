import {
  Form,
  Link,
  Outlet,
  useNavigation,
  useSubmit,
  useRouteError,
  useFetcher,
} from "react-router";
import { getSearchResults } from "../../data/searchData";

/**
 * Loader function - handles initial page load and URL search params
 * Called when:
 * - Page first loads
 * - URL search parameters change
 * @returns Search results and query string from URL
 */
export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const searchResults = q ? await getSearchResults(q) : [];
  return { searchResults, q };
};

/**
 * Action function - handles form submissions
 * Called when:
 * - Search form is submitted
 * - Input changes (via fetcher.submit)
 * @returns Search results and query string from form data
 */
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const query = formData.get("q");
  const searchResults = query ? await getSearchResults(query.toString()) : [];
  return { searchResults, q: query };
};

export default function Search({ loaderData }: { loaderData: any }) {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const { searchResults, q } = fetcher.data || loaderData;

  const searching =
    fetcher.state !== "idle" ||
    (navigation.location &&
      new URLSearchParams(navigation.location.search).has("q"));

  console.log("fetcher state:", fetcher.state);
  console.log("fetcher data:", fetcher.data);
  console.log("search query:", q);
  console.log("search results:", searchResults);

  return (
    <>
      <div id="sidebar">
        <h1>Search Page</h1>
        <fetcher.Form
          id="search-form"
          method="post"
          onChange={(event) => {
            const form = event.currentTarget as HTMLFormElement;
            fetcher.submit(form);
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
        </fetcher.Form>
        <nav>
          {fetcher.state !== "idle" ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="ml-2">Searching...</p>
            </div>
          ) : q ? (
            searchResults?.length ? (
              <ul>
                {searchResults.map((item) => (
                  <li key={item.id}>
                    <Link to={`list/${item.id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No results found</i>
              </p>
            )
          ) : null}
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

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.message}</i>
      </p>
    </div>
  );
}
