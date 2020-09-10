import AbstractView from "./abstract.js";

const createMovieListContainerTemplate = () => {
  return (
    `<div class="films-list__container">
    </div>`
  );
};

export default class MovieListContainer extends AbstractView {

  getTemplate() {
    return createMovieListContainerTemplate();
  }

}
