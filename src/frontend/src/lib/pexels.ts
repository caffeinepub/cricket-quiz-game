import type { PexelsResponse } from "../types/pexels";

// Pexels API key
export const PEXELS_API_KEY =
  "HcvU38MkNtHcnGTFyW6nzCxyv9b9i4AYuOyV8dxZxSu9WB6B4BJ10ZJa";

const BASE_URL = "https://api.pexels.com/v1";

export const IS_PLACEHOLDER_KEY = false;

async function pexelsFetch(url: string): Promise<PexelsResponse> {
  const response = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Pexels API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<PexelsResponse>;
}

export async function fetchCuratedPhotos(
  page = 1,
  perPage = 30,
): Promise<PexelsResponse> {
  return pexelsFetch(`${BASE_URL}/curated?per_page=${perPage}&page=${page}`);
}

export async function searchPhotos(
  query: string,
  page = 1,
  perPage = 30,
): Promise<PexelsResponse> {
  const encodedQuery = encodeURIComponent(query);
  return pexelsFetch(
    `${BASE_URL}/search?query=${encodedQuery}&per_page=${perPage}&page=${page}`,
  );
}
