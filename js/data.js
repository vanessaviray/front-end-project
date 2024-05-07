'use strict';
/* exported data */
let data = {
  view: 'welcome-page',
  cards: [],
  selectedCard: null,
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
