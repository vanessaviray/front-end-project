/* exported data */

interface Data {
  view: string;
  cards: CardInfo[];
  selectedCard: null | Element;
  selectedCardObject: null | CardInfo;
  nextCardId: number;
}

let data: Data = {
  view: 'welcome-page',
  cards: [],
  selectedCard: null,
  selectedCardObject: null,
  nextCardId: 1,
};

const previousEntriesJSON = localStorage.getItem('javascript-local-storage');

window.addEventListener('beforeunload', () => {
  const entriesJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', entriesJSON);
});

if (previousEntriesJSON) {
  data = JSON.parse(previousEntriesJSON);
}
