import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateTypeCard, updateTypeDetails, update) {
    this._comments = update.slice();

    this._notify(updateTypeCard, updateTypeDetails, update);
  }

  deleteComment(updateTypeCard, updateTypeDetails, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateTypeCard, updateTypeDetails);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          text: comment.comment,
          date: new Date(comment.date),
          autor: comment.author
        }
    );

    delete adaptedComment.comment;
    delete adaptedComment.author;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "emotion": comment.emotion,
          "comment": comment.text,
          "date": comment.date.toISOString()
        }
    );

    delete adaptedComment.text;
    delete adaptedComment.autor;

    return adaptedComment;
  }
}
