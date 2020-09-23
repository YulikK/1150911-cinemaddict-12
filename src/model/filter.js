import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateTypeCard, updateTypeDetails, filter) {
    this._activeFilter = filter;
    this._notify(updateTypeCard, updateTypeDetails, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
