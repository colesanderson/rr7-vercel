import { useParams, useRouteError, isRouteErrorResponse } from "react-router";
import { getSearchResults } from "~/data/searchData";

/**
 * Loader function - handles loading individual search result details
 * Called when:
 * - Navigating to a specific search result
 * - URL parameter [id] changes
 * @throws 404 Response if result not found
 * @returns The found search result item
 */
export async function loader({ params }: { params: { id: string } }) {
  const results = await getSearchResults(null, 0);
  const result = results.find((item) => item.id === Number(params.id));

  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }
}

export default function SearchResultDetail() {
  const { id } = useParams();

  return (
    <div>
      <h2>Search Result Detail</h2>
      <p>Details for item ID: {id}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div className="error-container">
      <h1>Oops! Something went wrong.</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </div>
  );
}
