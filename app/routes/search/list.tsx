import { useParams, useRouteError, isRouteErrorResponse } from "react-router";
import { getSearchResults } from "~/data/searchData";

export async function loader({ params }: { params: { id?: string } }) {
  if (!params.id) {
    return { message: "Please select a search result to view details" };
  }

  const results = await getSearchResults(null, 0);
  const result = results.find((item) => item.id === Number(params.id));

  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }

  return { result };
}

export default function SearchResultDetail() {
  const { id } = useParams();

  if (!id) {
    return (
      <div>
        <h2>Search Details</h2>
        <p>Please select a search result from the list to view details.</p>
      </div>
    );
  }

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
