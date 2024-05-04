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
  $cardContainerRow.innerHTML = '';
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
    console.log('Pokemon Data: ', cardObjects);
    if (searchCriteria === '') {
      displayNoMatches();
    } else {
      renderCards(cardObjects);
    }
  } catch (error) {
    console.log('Fetch function failed: ', error);
  }
}

// FUNCTION: to render cards for search result

function renderCards(cardObjects: any): any {
  // created an array of objects that each store the information of a single card

  const cardObjectsData = cardObjects.data;
  const cardInfoArray: any = [];

  for (let i = 0; i < cardObjectsData.length; i++) {
    const cardInfo: any = {
      smallImage: cardObjects.data[i].images.small,
      cardName: cardObjects.data[i].name,
      setName: cardObjects.data[i].set.name,
      cardNumber: cardObjects.data[i].number,
    };

    // access the price type data by order of rarity (starting with the most common)

    let marketPrice: any = '';
    let priceType = '';

    if (
      cardObjects.data[i].tcgplayer !== undefined &&
      cardObjects.data[i].tcgplayer.prices !== undefined
    ) {
      if (cardObjects.data[i].tcgplayer.prices.normal) {
        const normal = cardObjects.data[i].tcgplayer.prices.normal.market;
        priceType = 'Normal';
        marketPrice = formatMarketPrice(parseFloat(normal));
      } else if (cardObjects.data[i].tcgplayer.prices.holofoil) {
        const holofoil = cardObjects.data[i].tcgplayer.prices.holofoil.market;
        priceType = 'Holofoil';
        marketPrice = formatMarketPrice(parseFloat(holofoil));
      } else if (cardObjects.data[i].tcgplayer.prices.reverseHolofoil) {
        const reverseHolofoil =
          cardObjects.data[i].tcgplayer.prices.reverseHolofoil.market;
        priceType = 'Reverse Holofoil';
        marketPrice = formatMarketPrice(parseFloat(reverseHolofoil));
      } else if (cardObjects.data[i].tcgplayer.prices['1stEditionNormal']) {
        const firstEditionNormal =
          cardObjects.data[i].tcgplayer.prices['1stEditionNormal'].market;
        priceType = '1st Edition Normal';
        marketPrice = formatMarketPrice(parseFloat(firstEditionNormal));
      } else if (cardObjects.data[i].tcgplayer.prices['1stEditionHolofoil']) {
        const firstEditionHolofoil =
          cardObjects.data[i].tcgplayer.prices['1stEditionHolofoil'].market;
        priceType = '1st Edition Holofoil';
        marketPrice = formatMarketPrice(parseFloat(firstEditionHolofoil));
      } else if (cardObjects.data[i].tcgplayer.prices['1stEdition']) {
        const firstEdition =
          cardObjects.data[i].tcgplayer.prices['1stEdition'].market;
        priceType = '1st Edition';
        marketPrice = formatMarketPrice(parseFloat(firstEdition));
      } else if (cardObjects.data[i].tcgplayer.prices.unlimited) {
        const unlimited = cardObjects.data[i].tcgplayer.prices.unlimited.market;
        priceType = 'Unlimited';
        marketPrice = formatMarketPrice(parseFloat(unlimited));
      } else if (cardObjects.data[i].tcgplayer.prices.unlimitedHolofoil) {
        const unlimitedHolofoil =
          cardObjects.data[i].tcgplayer.prices.unlimitedHolofoil.market;
        priceType = 'Unlimited Holofoil';
        marketPrice = formatMarketPrice(parseFloat(unlimitedHolofoil));
      } else {
        marketPrice = 'Not Available';
      }
    }

    cardInfoArray.push(cardInfo);

    // DOM TREE: for search results

    const $cardContainer = document.createElement('div');
    $cardContainer.setAttribute('class', 'card-container column-full');
    $cardContainerRow.appendChild($cardContainer);

    const $imageElement = document.createElement('img');
    $imageElement.setAttribute('src', `${cardInfo.smallImage}`);
    $cardContainer.appendChild($imageElement);

    const $cardNameH4Element = document.createElement('h4');
    $cardNameH4Element.setAttribute('id', 'card-name-search-results');
    $cardNameH4Element.textContent = cardInfo.cardName;
    $cardContainer.appendChild($cardNameH4Element);

    const $setNamePElement = document.createElement('p');
    $setNamePElement.setAttribute('id', 'set-name-search-results');
    $setNamePElement.textContent = cardInfo.setName;
    $cardContainer.appendChild($setNamePElement);

    const $cardNumberPElement = document.createElement('p');
    $cardNumberPElement.setAttribute('id', 'card-number-search-results');
    $cardNumberPElement.textContent = cardInfo.cardNumber;
    $cardContainer.appendChild($cardNumberPElement);

    const $priceType = document.createElement('p');
    $priceType.setAttribute('id', 'price-type-search-results');
    $priceType.textContent = priceType;
    $cardContainer.appendChild($priceType);

    const $priceAndButton = document.createElement('div');
    $priceAndButton.setAttribute('id', 'price-and-button-search-results');
    $priceAndButton.setAttribute('class', 'row');
    $cardContainer.appendChild($priceAndButton);

    const $marketPrice = document.createElement('p');
    $marketPrice.setAttribute('id', 'market-price-search-results');
    $marketPrice.textContent = marketPrice;
    $priceAndButton.appendChild($marketPrice);

    const $addButton = document.createElement('button');
    $addButton.setAttribute('id', 'add-button-search-results');
    $addButton.textContent = '+';
    $priceAndButton.appendChild($addButton);
  }

  if (cardInfoArray.length === 0) {
    displayNoMatches();
  }
}

// FUNCTION AND DOM TREE: to show when there are no results

function displayNoMatches(): void {
  const $pokeballNoMatches = document.createElement('div');
  $pokeballNoMatches.setAttribute('id', 'pokeball-no-matches');
  $cardContainerRow.appendChild($pokeballNoMatches);

  const $pokeballImage = document.createElement('img');
  $pokeballImage.setAttribute('src', 'images/pokeball.png');
  $pokeballImage.setAttribute('alt', 'yellow pokeball');
  $pokeballImage.setAttribute('id', 'yellow-pokeball-image');
  $pokeballNoMatches.appendChild($pokeballImage);

  const $noMatches = document.createElement('p');
  $noMatches.setAttribute('id', 'no-matching-searches');
  $noMatches.textContent = `Hmm.. we couldn't find any cards matching your search criteria. Try searching by name (for example: "lugia" or "eevee")`;
  $pokeballNoMatches.appendChild($noMatches);
}

// FUNCTION: to format market value

function formatMarketPrice(price: any): string {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`;
  } else {
    return 'Not Available';
  }
}
