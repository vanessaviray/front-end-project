'use strict';
/* exported data */
let data = {
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
