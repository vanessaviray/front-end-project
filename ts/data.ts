/* exported data */

interface Data {
  view: string;
  cards: CardInfo[];
  nextCardId: number;
}

let data: Data = {
  view: 'welcome-page',
  cards: [],
  nextCardId: 1,
};

// console.log(data);

const previousEntriesJSON = localStorage.getItem('javascript-local-storage');

window.addEventListener('beforeunload', () => {
  const entriesJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', entriesJSON);
});

if (previousEntriesJSON) {
  data = JSON.parse(previousEntriesJSON);
}
