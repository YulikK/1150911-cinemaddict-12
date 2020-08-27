import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {

  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const showDetails = (container, detailsComponent) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (detailsComponent instanceof Abstract) {
    detailsComponent = detailsComponent.getElement();
  }
  container.appendChild(detailsComponent);
  container.classList.add(`hide-overflow`);
};

export const hideDetails = (container, detailsComponent) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (detailsComponent instanceof Abstract) {
    detailsComponent = detailsComponent.getElement();
  }
  container.removeChild(detailsComponent);
  container.classList.remove(`hide-overflow`);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const changeActiveSort = (sortComponent, oldSort, newSort) => {
  if (sortComponent instanceof Abstract) {
    sortComponent = sortComponent.getElement();
  }
  const oldSortElement = sortComponent.querySelector(`a[data-sort-type="${oldSort}"]`);
  const newSortElement = sortComponent.querySelector(`a[data-sort-type="${newSort}"]`);
  oldSortElement.classList.remove(`sort__button--active`);
  newSortElement.classList.add(`sort__button--active`);
};
