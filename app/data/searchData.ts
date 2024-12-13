export async function getSearchResults(
  query: string | null,
  delayMs: number = 2000
) {
  // Add configurable delay
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const allResults = [
    { id: 1, title: "Result 1", description: "Description 1" },
    { id: 2, title: "Result 2", description: "Description 2" },
    { id: 3, title: "Result 3", description: "Description 3" },
  ];

  if (!query) return allResults;

  return allResults.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );
}
