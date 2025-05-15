export async function fetchBooks(query: string) {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.items?.map((item: any) => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description
    })) || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}