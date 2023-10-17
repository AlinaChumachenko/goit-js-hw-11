import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40011347-164180987f1c1c9ecdd3b742f';

export async function fetchImages({ searchQuery, page }) {
  return await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: `${searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${page}`,
      per_page: 40,
    },
  });
}
