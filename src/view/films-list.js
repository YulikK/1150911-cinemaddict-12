import AbstractView from "./abstract.js";

const createFilmsListTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      </section>
    </section>`
  );
};

export default class FilmList extends AbstractView {

  getTemplate() {
    return createFilmsListTemplate();
  }

}
