import he from "he";
import {formatCommentDate} from "../utils/movie.js";
import SmartView from "./smart.js";
import {EMOTIONS} from "../const.js";

const deleteCommentTemplate = (id, isDisabled = false) => {
  return (
    `<button class="film-details__comment-delete" value="${id}"${isDisabled ? `disabled` : ``}>${isDisabled ? `Deleting...` : `Delete`}</button>`
  );
};

const createCommentTemplate = (comment) => {
  const {id, text, emotion, autor, date} = comment;
  const deleteTemplate = deleteCommentTemplate(id);
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${autor}</span>
          <span class="film-details__comment-day">${formatCommentDate(date)}</span>
          ${deleteTemplate}
        </p>
      </div>
    </li>`
  );

};

const createEmotionTemplate = (emotion, checked = false) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checked ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`
  );

};

const createEmojiListTemplate = () => {

  const emotionTemplate = EMOTIONS
  .map((emotion) => createEmotionTemplate(emotion))
  .join(``);

  return (
    `<div class="film-details__emoji-list">
      ${emotionTemplate}
    </div>`
  );

};

const createCommentsTemplate = (comments) => {

  const commentTemplate = comments
  .map((comment) => createCommentTemplate(comment))
  .join(``);

  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${commentTemplate}
        </ul>
        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          ${createEmojiListTemplate()}
        </div>
      </section>
    </div>`
  );

};

const createAddEmojiTemplate = (emotion) => {
  return (
    `<div for="add-emoji" class="film-details__add-emoji-label">
      <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </div>`
  );
};

export default class Comments extends SmartView {
  constructor(commentsModel) {
    super();
    this._comments = commentsModel;

    this._currentEmoji = null;

    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  getNewComment() {
    return this.getElement().querySelector(`.film-details__comment-input`).value;
  }

  getNewEmoji() {
    return this._currentEmoji;
  }

  changeEmoji(newEmoji) {
    if (this._currentEmoji !== newEmoji) {
      const preEmoji = this._currentEmoji;
      this._currentEmoji = newEmoji;
      this._setNewEmoji(newEmoji);
      this._setActiveEmojiItem(newEmoji, preEmoji);
    }
  }

  setDeletingState(comment, isDisabled) {
    const selectorUpdateElement = `button[value="${comment.id}"]`;
    const elementTemplate = deleteCommentTemplate(comment.id, isDisabled);
    const restoreCallback = this._deleteClickHandler;

    this.updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate);
  }

  setCommentsState(isOnline) {
    const commentElements = this.getElement().querySelectorAll(`.film-details__comments-wrap button, .film-details__comments-wrap textarea, .film-details__comments-wrap input`);
    commentElements.forEach((element) => {
      if (!isOnline) {
        element.setAttribute(`disabled`, `disabled`);
      } else {
        element.removeAttribute(`disabled`);
      }
    });
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    const commentsItems = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    commentsItems
      .forEach((commentItem) => commentItem.addEventListener(`click`, this._deleteClickHandler));
  }

  setEmojiClickHandler(callback) {
    this._callback.emojiClick = callback;
    const emojiItems = this.getElement().querySelectorAll(`input[name=comment-emoji]`);
    emojiItems
      .forEach((emojiItem) => emojiItem.addEventListener(`click`, this._emojiClickHandler));
  }

  _setNewEmoji(newEmoji) {
    const selectorUpdateElement = `.film-details__add-emoji-label`;
    const elementTemplate = createAddEmojiTemplate(newEmoji);
    const restoreCallback = this._emojiClickHandler;
    this.updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate);
  }

  _setActiveEmojiItem(newEmoji, oldEmoji) {
    let selectorUpdateElement = `input[id=emoji-${newEmoji}]`;
    let elementTemplate = createEmotionTemplate(newEmoji, true);
    let restoreCallback = this._emojiClickHandler;

    this.updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate);

    if (oldEmoji !== null) {
      selectorUpdateElement = `input[id=emoji-${oldEmoji}]`;
      elementTemplate = createEmotionTemplate(oldEmoji, false);
      restoreCallback = this._emojiClickHandler;

      this.updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate);
    }
  }

  _getElementById(id) {
    const index = this._comments.findIndex((comment) => comment.id === id);
    const commentElement = this._comments[index];
    return commentElement;

  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    const commentId = this._getElementById(evt.target.value);
    this.setDeletingState(commentId, true);
    this._callback.deleteClick(commentId);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this._callback.emojiClick(evt.target.value);
  }
}
