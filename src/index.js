import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './pixabay-api';
import { createMarkup } from './markup';

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captions: true,
  captionsData: 'alt',
});

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoadMore);

let searchQuery;
let page = 0;
const perPage = 40;

loadBtn.style.display = 'none';

function onSearch(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;

  if (!searchQuery) {
    Notify.warning('Make your choice.');
  } else {
    page = 1;
    gallery.innerHTML = '';

    fetchImages({ searchQuery, page })
      .then(response => {
        if (!response.data.hits.length) {
          gallery.innerHTML = '';
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          loadBtn.style.display = 'none';
        } else if (page >= Math.ceil(response.data.totalHits / perPage)) {
          gallery.innerHTML = '';
          renderMarkup(response);
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
          loadBtn.style.display = 'none';
        } else {
          gallery.innerHTML = '';
          renderMarkup(response);
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          lightbox.refresh();
          loadBtn.style.display = '';
          
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}

function renderMarkup(response) {
  const markupCards = createMarkup(response);
  gallery.insertAdjacentHTML('beforeend', markupCards);
}

function onLoadMore() {
  page += 1;

  fetchImages({ searchQuery, page })
    .then(response => {
      renderMarkup(response);
      lightbox.refresh();
      smoothScroll();
      const totalPages = Math.ceil(response.data.totalHits / perPage);
      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notify.success(
          `Hooray! We found ${
            response.data.totalHits - perPage * (page - 1)
          } images.`
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


