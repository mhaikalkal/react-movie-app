import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // const { searchTerm, movie } = props;

  // 1. Use Appwrite SDK / API to check if the search is exist in the database.
  try {
    // querynya kan di akhir, di pake array []. itu biar bisa chaining query
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]); // yang "searchTerm" itu nama isi tabel di database, yg searchTerm kedua, itu props yang dikirim

    // 2. if exist, then update the count.
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // doc.$id ini dia nge generate unique id, karena di tabelnya otomatis ngebuat id sendiri,
      console.log(doc.$id);
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
      // 3. if not, create a new document with the searchTerm and count it as 1.
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        movie_id: movie.id,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
