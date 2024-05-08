'use strict';
// DOM QUERIES, INTERFACES, AND VARIABLES:
const $form = document.querySelector('form');
const $welcomePage = document.querySelector('.welcome-page');
const $searchResults = document.querySelector('#search-results');
const $marketmonLogo = document.querySelector('.marketmon-logo');
const $searchInput = document.querySelector('.search-input');
const $cardContainerRow = document.querySelector('.card-container-row');
const $myCollection = document.querySelector('#my-collection');
const $myCollectionButton = document.querySelector('.my-collection-button');
const $cardContainerRowCollection = document.querySelector(
  '.card-container-row-collection',
);
const $cancelButton = document.querySelector('.cancel-button');
const $confirmRemoveButton = document.querySelector('.confirm-remove-button');
const $dialog = document.querySelector('dialog');
const $xIcon = document.querySelector('.fa-x');
const $noCardsMessages = document.querySelector('.no-cards-message');
const $dollars = document.querySelector('.dollars');
const $cardDetails = document.querySelector('#card-details');
const $pokemonNameCardDetails = document.querySelector(
  '.pokemon-name-card-details',
);
const $setNameCardDetails = document.querySelector('.set-name-card-details');
const $numberCardDetails = document.querySelector('.number-card-details');
const $rarityCardDetails = document.querySelector('.rarity-card-details');
const $illustratorCardDetails = document.querySelector(
  '.illustrator-card-details',
);
const $dollarCardDetails = document.querySelector('.dollar-card-details');
const $largeImage = document.querySelector('.large-image');
const $xButtonCardDetails = document.querySelector('.x-button-card-details');
const $cardDetailsAddButton = document.querySelector('.card-details-button');
const domQueries = {
  $form,
  $welcomePage,
  $searchResults,
  $marketmonLogo,
  $searchInput,
  $cardContainerRow,
  $myCollection,
  $myCollectionButton,
  $cardContainerRowCollection,
  $cancelButton,
  $confirmRemoveButton,
  $dialog,
  $xIcon,
  $noCardsMessages,
  $dollars,
  $cardDetails,
  $pokemonNameCardDetails,
  $setNameCardDetails,
  $numberCardDetails,
  $rarityCardDetails,
  $illustratorCardDetails,
  $dollarCardDetails,
  $largeImage,
  $xButtonCardDetails,
  $cardDetailsAddButton,
};
for (const key in domQueries) {
  if (!domQueries[key]) throw new Error(`The ${key} dom query failed`);
}
let previousView = '';
// EVENT LISTENER: to listen for when the MarketMon logo is clicked
$marketmonLogo.addEventListener('click', () => {
  viewSwap('welcome-page');
  $searchInput.value = '';
});
// EVENT LISTENER: to listen for when a search is submitted
$form.addEventListener('submit', (event) => {
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
function viewSwap(view) {
  const valueOfView = view;
  data.view = valueOfView;
  if (view === 'welcome-page') {
    $welcomePage.className = 'row container welcome-page show';
    $searchResults.className = 'hidden';
    $myCollection.className = 'hidden';
    $cardDetails.className = 'hidden';
  } else if (view === 'search-results') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'show';
    $myCollection.className = 'hidden';
    $cardDetails.className = 'hidden';
  } else if (view === 'my-collection') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'hidden';
    $myCollection.className = 'show';
    $cardDetails.className = 'hidden';
  } else if (view === 'card-details') {
    $welcomePage.className = 'hidden';
    $searchResults.className = 'hidden';
    $myCollection.className = 'hidden';
    $cardDetails.className = 'show';
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
function renderSearchedCards(cardObjects) {
  // created an array of objects that each store the information of a single card
  const cardInfoArray = [];
  const cardObjectsData = cardObjects.data;
  for (let i = 0; i < cardObjectsData.length; i++) {
    const cardInfo = {
      smallImage: cardObjects.data[i].images.small,
      cardName: cardObjects.data[i].name,
      setName: cardObjects.data[i].set.name,
      cardNumber: cardObjects.data[i].number,
      rarity: cardObjects.data[i].rarity,
      illustrator: cardObjects.data[i].artist,
      cardId: 0,
    };
    if (cardObjects.data[i].images.large !== undefined) {
      cardInfo.largeImage = cardObjects.data[i].images.large;
    } else {
      cardInfo.largeImage = cardObjects.data[i].images.small;
    }
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
    // EVENT LISTENER: to listen for when a card object is clicked and checks if user wants to quick add to collection
    $cardContainer.addEventListener('click', (event) => {
      $cardDetailsAddButton.className = 'card-details-button';
      const eventTarget = event.target;
      if (eventTarget.tagName === 'BUTTON') {
        $addButton.addEventListener('click', () => {
          alert('Card Added Successfully', 1000);
          cardInfo.cardId = data.nextCardId;
          data.cards.unshift(cardInfo);
          data.nextCardId++;
        });
      } else {
        data.selectedCardObject = cardInfo;
        storeScrollPosition();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setValuesOfCard(cardInfo);
        viewSwap('card-details');
        previousView = 'search-results';
      }
    });
  }
  if (cardInfoArray.length === 0) {
    displayNoMatches();
  }
}
// EVENT LISTENER: to add a card from the 'card-details' view
$cardDetailsAddButton.addEventListener('click', () => {
  alert('Card Added Successfully', 1000);
  if (data.selectedCardObject !== null) {
    data.selectedCardObject.cardId = data.nextCardId;
    data.cards.unshift(data.selectedCardObject);
    data.nextCardId++;
  }
});
// FUNCTION AND DOM TREE: to show when there are no results
function displayNoMatches() {
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
function formatMarketPrice(price) {
  if (typeof price === 'number') {
    if (price.toString() === 'NaN') {
      return 'Not Available';
    } else {
      return `$${price.toFixed(2)}`;
    }
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
  noCardsInCollection();
  getMarketValue();
});
// FUNCTION: to show alert for adding or deleting cards to collection
function alert(message, duration) {
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
function renderCollectionCards() {
  for (let i = 0; i < data.cards.length; i++) {
    const $cardContainer = document.createElement('div');
    $cardContainer.setAttribute('class', 'card-container column-full');
    $cardContainer.setAttribute(
      'data-card-id',
      data.cards[i].cardId.toString(),
    );
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
    $priceType.textContent = data.cards[i].priceType;
    $cardContainer.appendChild($priceType);
    const $priceAndButton = document.createElement('div');
    $priceAndButton.setAttribute(
      'class',
      'row price-and-button-search-results',
    );
    $cardContainer.appendChild($priceAndButton);
    const $marketPrice = document.createElement('p');
    $marketPrice.setAttribute('class', 'market-price-search-results');
    $marketPrice.textContent = data.cards[i].marketPrice;
    $priceAndButton.appendChild($marketPrice);
    const $removeButton = document.createElement('button');
    $removeButton.setAttribute('class', 'add-button-search-results');
    $removeButton.textContent = '-';
    $priceAndButton.appendChild($removeButton);
    $cardContainer.addEventListener('click', (event) => {
      const clickedCardDataId = $cardContainer.getAttribute('data-card-id');
      const clickedCardId = parseInt(clickedCardDataId);
      const clickedCardIndex = data.cards.findIndex(
        (card) => card.cardId === clickedCardId,
      );
      const closestResult = $removeButton.closest('.card-container');
      data.selectedCard = closestResult;
      const eventTarget = event.target;
      if (eventTarget.tagName === 'BUTTON') {
        $dialog.showModal();
        storeScrollPosition();
      } else {
        const clickedCardInfo = data.cards[clickedCardIndex];
        data.selectedCardObject = data.cards[i];
        storeScrollPosition();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setValuesOfCard(clickedCardInfo);
        viewSwap('card-details');
        $cardDetailsAddButton.className = 'hidden';
        previousView = 'my-collection';
      }
    });
  }
}
$xIcon.addEventListener('click', () => {
  restoreScrollPosition();
  $dialog.close();
});
$cancelButton.addEventListener('click', () => {
  restoreScrollPosition();
  $dialog.close();
});
$confirmRemoveButton.addEventListener('click', () => {
  $dialog.close();
  const dataCardId = data.selectedCard?.getAttribute('data-card-id');
  for (let i = 0; i < data.cards.length; i++) {
    if (data.cards[i].cardId.toString() === dataCardId) {
      data.cards.splice(i, 1);
      data.selectedCard?.remove();
      getMarketValue();
      noCardsInCollection();
    }
  }
  alert('Card Removed Successfully', 1000);
});
// FUNCTION: to display message if there are no cards in the collection
function noCardsInCollection() {
  if (data.cards.length === 0) {
    $noCardsMessages.className = 'no-cards-message';
    $dollars.textContent = '$0.00';
  } else {
    $noCardsMessages.className = 'no-cards-message hidden';
  }
}
// FUNCTION: to calculate and update the market value of the collection
function getMarketValue() {
  let totalMarketValue = 0;
  for (let i = 0; i < data.cards.length; i++) {
    const marketPrice = data.cards[i].marketPrice;
    if (marketPrice !== 'Not Available') {
      const convertToNum = parseFloat(marketPrice.replace('$', ''));
      totalMarketValue += convertToNum;
      $dollars.textContent = `$${totalMarketValue.toFixed(2)}`;
    }
  }
}
// FUNCTION: to set the values of the card selected
function setValuesOfCard(cardInfo) {
  if (cardInfo.largeImage !== undefined) {
    $largeImage.setAttribute('src', cardInfo.largeImage);
  }
  $pokemonNameCardDetails.textContent = cardInfo.cardName;
  $setNameCardDetails.textContent = cardInfo.setName;
  $numberCardDetails.textContent = cardInfo.cardNumber;
  if (cardInfo.rarity === undefined) {
    $rarityCardDetails.textContent = 'Not Available';
  } else {
    $rarityCardDetails.textContent = cardInfo.rarity;
  }
  $illustratorCardDetails.textContent = cardInfo.illustrator;
  if (typeof cardInfo.marketPrice === 'string') {
    $dollarCardDetails.textContent = cardInfo.marketPrice;
  }
}
// EVENT LISTENER: to exit out of card details view
$xButtonCardDetails.addEventListener('click', () => {
  viewSwap(previousView);
  restoreScrollPosition();
});
// FUNCTIONS: to store and restore scroll positions
let scrollPosition = 0;
function storeScrollPosition() {
  scrollPosition = window.scrollY;
}
function restoreScrollPosition() {
  setTimeout(() => {
    window.scrollTo(0, scrollPosition);
  }, 0);
}
