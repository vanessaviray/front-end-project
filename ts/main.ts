// INTERFACES:

interface CardInfo {
  smallImage: string;
  cardName: string;
  setName: string;
  cardNumber: string;
  priceType?: string;
  marketPrice?: string;
  cardId?: number;
}

// DOM QUERIES:

const $form = document.querySelector('form') as HTMLFormElement;
const $welcomePage = document.querySelector('.welcome-page') as HTMLDivElement;
const $searchResults = document.querySelector(
  '#search-results',
) as HTMLDivElement;
const $marketmonLogo = document.querySelector(
  '.marketmon-logo',
) as HTMLImageElement;
const $searchInput = document.querySelector('.search-input') as HTMLFormElement;
const $cardContainerRow = document.querySelector(
  '.card-container-row',
) as HTMLDivElement;
const $myCollection = document.querySelector(
  '#my-collection',
) as HTMLDivElement;
const $myCollectionButton = document.querySelector(
  '.my-collection-button',
) as HTMLButtonElement;
const $cardContainerRowCollection = document.querySelector(
  '.card-container-row-collection',
) as HTMLDivElement;

const domQueries: Record<string, any> = {
  $form,
  $welcomePage,
  $searchResults,
  $marketmonLogo,
  $searchInput,
  $cardContainerRow,
  $myCollection,
  $myCollectionButton,
  $cardContainerRowCollection,
};

for (const key in domQueries) {
  if (!domQueries[key]) throw new Error(`The ${key} dom query failed`);
}

// EVENT LISTENER: to listen for when the MarketMon logo is clicked

$marketmonLogo.addEventListener('click', () => {
  viewSwap('welcome-page');
  $searchInput.value = '';
});

// EVENT LISTENER: to listen for when a search is submitted

$form.addEventListener('submit', (event: Event): void => {
  event.preventDefault();
  viewSwap('search-results');
  $cardContainerRow.innerHTML = '';
  const nameOfPokemonSearched = $searchInput.value;
  if (nameOfPokemonSearched === '') {
    displayNoMatches();
  } else {
    fetchCards(nameOfPokemonSearched);
  }
});

// FUNCTION: to swap views

function viewSwap(view: string): void {
  const valueOfView = view;
  data.view = valueOfView;

  if (view === 'welcome-page') {
    $welcomePage.className = 'row container welcome-page show';
    $searchResults.className = 'hidden';
    $myCollection.className = 'hidden';
  } else if (view === 'search-results') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'show';
    $myCollection.className = 'hidden';
  } else if (view === 'my-collection') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'hidden';
    $myCollection.className = 'show';
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
    if (searchCriteria === '') {
      displayNoMatches();
    } else {
      renderSearchedCards(cardObjects);
    }
  } catch (error) {
    console.log('Fetch function failed: ', error);
  }
}

// FUNCTION: to render cards for search result

function renderSearchedCards(cardObjects: any): any {
  // created an array of objects that each store the information of a single card

  const cardInfoArray: CardInfo[] = [];
  const cardObjectsData = cardObjects.data;

  for (let i = 0; i < cardObjectsData.length; i++) {
    const cardInfo: CardInfo = {
      smallImage: cardObjects.data[i].images.small,
      cardName: cardObjects.data[i].name,
      setName: cardObjects.data[i].set.name,
      cardNumber: cardObjects.data[i].number,
    };

    // access the price type data by order of rarity (starting with the most common)

    if (
      cardObjects.data[i].tcgplayer !== undefined &&
      cardObjects.data[i].tcgplayer.prices !== undefined
    ) {
      if (cardObjects.data[i].tcgplayer.prices.normal) {
        const normal = cardObjects.data[i].tcgplayer.prices.normal.market;
        cardInfo.priceType = 'Normal';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(normal));
      } else if (cardObjects.data[i].tcgplayer.prices.holofoil) {
        const holofoil = cardObjects.data[i].tcgplayer.prices.holofoil.market;
        cardInfo.priceType = 'Holofoil';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(holofoil));
      } else if (cardObjects.data[i].tcgplayer.prices.reverseHolofoil) {
        const reverseHolofoil =
          cardObjects.data[i].tcgplayer.prices.reverseHolofoil.market;
        cardInfo.priceType = 'Reverse Holofoil';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(reverseHolofoil));
      } else if (cardObjects.data[i].tcgplayer.prices['1stEditionNormal']) {
        const firstEditionNormal =
          cardObjects.data[i].tcgplayer.prices['1stEditionNormal'].market;
        cardInfo.priceType = '1st Edition Normal';
        cardInfo.marketPrice = formatMarketPrice(
          parseFloat(firstEditionNormal),
        );
      } else if (cardObjects.data[i].tcgplayer.prices['1stEditionHolofoil']) {
        const firstEditionHolofoil =
          cardObjects.data[i].tcgplayer.prices['1stEditionHolofoil'].market;
        cardInfo.priceType = '1st Edition Holofoil';
        cardInfo.marketPrice = formatMarketPrice(
          parseFloat(firstEditionHolofoil),
        );
      } else if (cardObjects.data[i].tcgplayer.prices['1stEdition']) {
        const firstEdition =
          cardObjects.data[i].tcgplayer.prices['1stEdition'].market;
        cardInfo.priceType = '1st Edition';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(firstEdition));
      } else if (cardObjects.data[i].tcgplayer.prices.unlimited) {
        const unlimited = cardObjects.data[i].tcgplayer.prices.unlimited.market;
        cardInfo.priceType = 'Unlimited';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(unlimited));
      } else if (cardObjects.data[i].tcgplayer.prices.unlimitedHolofoil) {
        const unlimitedHolofoil =
          cardObjects.data[i].tcgplayer.prices.unlimitedHolofoil.market;
        cardInfo.priceType = 'Unlimited Holofoil';
        cardInfo.marketPrice = formatMarketPrice(parseFloat(unlimitedHolofoil));
      } else {
        cardInfo.priceType = 'Market Value';
        cardInfo.marketPrice = 'Not Available';
      }
    } else {
      cardInfo.priceType = 'Market Value';
      cardInfo.marketPrice = 'Not Available';
    }

    cardInfoArray.push(cardInfo);

    // DOM TREE: to render search results

    const $cardContainer = document.createElement('div');
    $cardContainer.setAttribute('class', 'card-container column-full');
    $cardContainerRow.appendChild($cardContainer);

    const $imageElement = document.createElement('img');
    $imageElement.setAttribute('src', `${cardInfo.smallImage}`);
    $imageElement.setAttribute('alt', 'pokemon card');
    $cardContainer.appendChild($imageElement);

    const $cardNameH4Element = document.createElement('h4');
    $cardNameH4Element.setAttribute('class', 'card-name-search-results');
    $cardNameH4Element.textContent = cardInfo.cardName;
    $cardContainer.appendChild($cardNameH4Element);

    const $setNamePElement = document.createElement('p');
    $setNamePElement.setAttribute('class', 'set-name-search-results');
    $setNamePElement.textContent = cardInfo.setName;
    $cardContainer.appendChild($setNamePElement);

    const $cardNumberPElement = document.createElement('p');
    $cardNumberPElement.setAttribute('class', 'card-number-search-results');
    $cardNumberPElement.textContent = cardInfo.cardNumber;
    $cardContainer.appendChild($cardNumberPElement);

    const $priceType = document.createElement('p');
    $priceType.setAttribute('class', 'price-type-search-results');
    $priceType.textContent = cardInfo.priceType;
    $cardContainer.appendChild($priceType);

    const $priceAndButton = document.createElement('div');
    $priceAndButton.setAttribute(
      'class',
      'row price-and-button-search-results',
    );
    $cardContainer.appendChild($priceAndButton);

    const $marketPrice = document.createElement('p');
    $marketPrice.setAttribute('class', 'market-price-search-results');
    $marketPrice.textContent = cardInfo.marketPrice;
    $priceAndButton.appendChild($marketPrice);

    const $addButton = document.createElement('button');
    $addButton.setAttribute('class', 'add-button-search-results');
    $addButton.textContent = '+';
    $priceAndButton.appendChild($addButton);

    // EVENT LISTENER: to listen for when the add button is clicked

    $addButton.addEventListener('click', () => {
      alert('Card Added Successfully', 1000);
      cardInfo.cardId = data.nextCardId;
      data.cards.unshift(cardInfo);
      data.nextCardId++;
    });
  }

  if (cardInfoArray.length === 0) {
    displayNoMatches();
  }
}

// FUNCTION AND DOM TREE: to show when there are no results

function displayNoMatches(): void {
  const $pokeballNoMatches = document.createElement('div');
  $pokeballNoMatches.setAttribute('class', 'pokeball-no-matches');
  $cardContainerRow.appendChild($pokeballNoMatches);

  const $pokeballImage = document.createElement('img');
  $pokeballImage.setAttribute('src', 'images/pokeball.png');
  $pokeballImage.setAttribute('alt', 'yellow pokeball');
  $pokeballImage.setAttribute('class', 'yellow-pokeball-image');
  $pokeballNoMatches.appendChild($pokeballImage);

  const $noMatches = document.createElement('p');
  $noMatches.setAttribute('class', 'no-matching-searches');
  $noMatches.textContent = `Hmm.. we couldn't find any cards matching your search criteria. Try searching by name (for example: "lugia" or "eevee").`;
  $pokeballNoMatches.appendChild($noMatches);
}

// FUNCTION: to format the display of the market value

function formatMarketPrice(price: unknown): string {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`;
  } else {
    return 'Not Available';
  }
}

// EVENT LISTENER: to listen for when the 'My Collection' button is clicked

$myCollectionButton.addEventListener('click', () => {
  viewSwap('my-collection');
  $searchInput.value = '';
  $cardContainerRowCollection.innerHTML = '';
  renderCollectionCards();
});

// FUNCTION: to show alert for adding or deleting cards to collection

function alert(message: string, duration: number): void {
  const $alert = document.createElement('div');
  $alert.setAttribute('class', 'row alert');
  document.body.appendChild($alert);

  const $checkMark = document.createElement('i');
  $checkMark.setAttribute('class', 'fa-solid fa-check');
  $alert.appendChild($checkMark);

  const $alertMessage = document.createElement('p');
  $alertMessage.setAttribute('class', 'alert-message');
  $alertMessage.textContent = message;
  $alert.appendChild($alertMessage);

  setTimeout(() => {
    document.body.removeChild($alert);
  }, duration);
}

// FUNCTION: to render collection

function renderCollectionCards(): void {
  for (let i = 0; i < data.cards.length; i++) {
    const $cardContainer = document.createElement('div');
    $cardContainer.setAttribute('class', 'card-container column-full');
    $cardContainerRowCollection.appendChild($cardContainer);

    const $imageElement = document.createElement('img');
    $imageElement.setAttribute('src', `${data.cards[i].smallImage}`);
    $imageElement.setAttribute('alt', 'pokemon card');
    $cardContainer.appendChild($imageElement);

    const $cardNameH4Element = document.createElement('h4');
    $cardNameH4Element.setAttribute('class', 'card-name-search-results');
    $cardNameH4Element.textContent = data.cards[i].cardName;
    $cardContainer.appendChild($cardNameH4Element);

    const $setNamePElement = document.createElement('p');
    $setNamePElement.setAttribute('class', 'set-name-search-results');
    $setNamePElement.textContent = data.cards[i].setName;
    $cardContainer.appendChild($setNamePElement);

    const $cardNumberPElement = document.createElement('p');
    $cardNumberPElement.setAttribute('class', 'card-number-search-results');
    $cardNumberPElement.textContent = data.cards[i].cardNumber;
    $cardContainer.appendChild($cardNumberPElement);

    const $priceType = document.createElement('p');
    $priceType.setAttribute('class', 'price-type-search-results');
    $priceType.textContent = data.cards[i].priceType as string;
    $cardContainer.appendChild($priceType);

    const $priceAndButton = document.createElement('div');
    $priceAndButton.setAttribute(
      'class',
      'row price-and-button-search-results',
    );
    $cardContainer.appendChild($priceAndButton);

    const $marketPrice = document.createElement('p');
    $marketPrice.setAttribute('class', 'market-price-search-results');
    $marketPrice.textContent = data.cards[i].marketPrice as string;
    $priceAndButton.appendChild($marketPrice);

    const $removeButton = document.createElement('button');
    $removeButton.setAttribute('class', 'add-button-search-results');
    $removeButton.textContent = '-';
    $priceAndButton.appendChild($removeButton);
  }
}
