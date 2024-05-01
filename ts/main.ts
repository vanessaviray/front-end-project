// QUERIES

const $form = document.querySelector('form') as HTMLFormElement;
const $welcomePage = document.querySelector('#welcome-page') as HTMLDivElement;
const $searchResults = document.querySelector(
  '#search-results',
) as HTMLDivElement;
const $marketmonLogo = document.querySelector(
  '#marketmon-logo',
) as HTMLImageElement;

if (!$form) throw new Error('the $from query failed.');
if (!$welcomePage) throw new Error(`the $welcomePage query failed`);
if (!$searchResults) throw new Error(`the $searchResults query failed`);
if (!$marketmonLogo) throw new Error(`the $marketmonLogo query failed`);

// EVENT LISTENER: to listen for when the MarketMon logo is clicked

$marketmonLogo.addEventListener('click', () => {
  console.log('hello');
  viewSwap('welcome-page');
});

// EVENT LISTENER: to listen for when a search is submitted

$form.addEventListener('submit', (event: Event): void => {
  event.preventDefault();
  viewSwap('search-results');
});

// FUNCTION: to swap views

function viewSwap(view: string): void {
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
