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
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};
