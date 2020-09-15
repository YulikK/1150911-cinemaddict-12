import AbstractView from "./abstract.js";

const createNoMovieTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoMovie extends AbstractView {

  getTemplate() {
    return createNoMovieTemplate();
  }

}
