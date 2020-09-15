import AbstractView from "./abstract.js";

const createMovieListTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class MovieList extends AbstractView {

  getTemplate() {
    return createMovieListTemplate();
  }

}
