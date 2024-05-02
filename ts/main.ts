// QUERIES

const $form = document.querySelector('form') as HTMLFormElement;
const $welcomePage = document.querySelector('#welcome-page') as HTMLDivElement;
const $searchResults = document.querySelector(
  '#search-results',
) as HTMLDivElement;
const $marketmonLogo = document.querySelector(
  '#marketmon-logo',
) as HTMLImageElement;
const $searchInput = document.querySelector('#search-input') as HTMLFormElement;
const $cardContainerRow = document.querySelector(
  '#card-container-row',
) as HTMLDivElement;

if (!$form) throw new Error('the $from query failed.');
if (!$welcomePage) throw new Error('the $welcomePage query failed');
if (!$searchResults) throw new Error('the $searchResults query failed');
if (!$marketmonLogo) throw new Error('the $marketmonLogo query failed');
if (!$searchInput) throw new Error('the $searchInput query failed.');
if (!$cardContainerRow) throw new Error('the $cardContainerRow query failed.');

// EVENT LISTENER: to listen for when the MarketMon logo is clicked

$marketmonLogo.addEventListener('click', () => {
  viewSwap('welcome-page');
});

// EVENT LISTENER: to listen for when a search is submitted

$form.addEventListener('submit', (event: Event): void => {
  event.preventDefault();
  viewSwap('search-results');
  const nameOfPokemonSearched = $searchInput.value;
  fetchCards(nameOfPokemonSearched);
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

// FUNCTION: to fetch information from api

async function fetchCards(searchCriteria: unknown): Promise<void> {
  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${searchCriteria}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const cardObjects = await response.json();

    renderCards(cardObjects);
    // console.log('Pokemon Data: ', cardObjects);
  } catch (error) {
    console.log('Fetch function failed: ', error);
  }
}

// FUNCTION: to render cards

function renderCards(cardObjects: any): any {
  // get card info array
  const cardObjectsData = cardObjects.data;
  const cardInfoArray: any = [];

  for (let i = 0; i < cardObjectsData.length; i++) {
    const cardInfo: any = {};

    const smallImage = cardObjects.data[i].images.small;
    const cardName = cardObjects.data[i].name;
    const setName = cardObjects.data[i].set.name;
    const cardNumber = cardObjects.data[i].number;

    cardInfo.smallImage = smallImage;
    cardInfo.cardName = cardName;
    cardInfo.setName = setName;
    cardInfo.cardNumber = cardNumber;

    cardInfoArray.push(cardInfo);

    // render the dom tree

    const $cardContainer = document.createElement('div');
    $cardContainer.setAttribute('class', 'card-container');
    $cardContainerRow.appendChild($cardContainer);

    const $imageElement = document.createElement('img');
    $imageElement.setAttribute('src', `${cardInfo.smallImage}`);
    $cardContainer.appendChild($imageElement);

    const $cardNameH4Element = document.createElement('h4');
    $cardNameH4Element.textContent = cardInfo.cardName;
    $cardContainer.appendChild($cardNameH4Element);

    const $setNamePElement = document.createElement('p');
    $setNamePElement.textContent = cardInfo.setName;
    $cardContainer.appendChild($setNamePElement);

    const $cardNumberPElement = document.createElement('p');
    $cardNumberPElement.textContent = cardInfo.cardNumber;
    $cardContainer.appendChild($cardNumberPElement);

    console.log($cardContainerRow);
  }
  console.log(cardInfoArray);
}

// DOM TREE VISUAL:
