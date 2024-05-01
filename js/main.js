'use strict';
// QUERIES
const $form = document.querySelector('form');
const $welcomePage = document.querySelector('#welcome-page');
const $searchResults = document.querySelector('#search-results');
const $marketmonLogo = document.querySelector('#marketmon-logo');
const $searchInput = document.querySelector('#search-input');
if (!$form) throw new Error('the $from query failed.');
if (!$welcomePage) throw new Error('the $welcomePage query failed');
if (!$searchResults) throw new Error('the $searchResults query failed');
if (!$marketmonLogo) throw new Error('the $marketmonLogo query failed');
if (!$searchInput) throw new Error('the $searchInput query failed.');
// EVENT LISTENER: to listen for when the MarketMon logo is clicked
$marketmonLogo.addEventListener('click', () => {
  console.log('hello');
  viewSwap('welcome-page');
});
// EVENT LISTENER: to listen for when a search is submitted
$form.addEventListener('submit', (event) => {
  event.preventDefault();
  viewSwap('search-results');
  const nameOfPokemonSearched = $searchInput.value;
  fetchCards(nameOfPokemonSearched);
});
// FUNCTION: to swap views
function viewSwap(view) {
  const valueOfView = view;
  data.view = valueOfView;
  if (view === 'welcome-page') {
    $welcomePage.className = 'row container show';
    $searchResults.className = 'hidden';
  } else if (view === 'search-results') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'show';
  }
}
// FUNCTION: to fetch information from api
async function fetchCards(searchCriteria) {
  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${searchCriteria}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Pokemon Data: ', data);
  } catch (error) {
    console.log('Fetch function failed: ', error);
  }
}
