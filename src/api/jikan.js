import axios from "axios";

import axios from "axios";

const jikan = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 10000,
});

export async function getAnimeGenres() {
  const { data } = await jikan.get("/genres/anime");
  return data.data;
}

export async function getAnimeByGenre(genreId, page = 1) {
  const { data } = await jikan.get("/anime", {
    params: {
      genres: genreId,
      page,
      order_by: "score",
      sort: "desc",
    },
  });
  return data; 
}

export async function getAnimeDetails(id) {
  const { data } = await jikan.get(`/anime/${id}/full`);
  return data.data;
}
