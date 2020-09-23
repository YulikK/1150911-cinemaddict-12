import FilterView from "../view/filter.js";
import StatsView from "../view/stats.js";
import {render, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {ucFirst} from "../utils/common.js";
import {FilterType, UpdateType, MenuItem} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilter = null;
    this._changeMenuItem = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._statsComponent = new StatsView();
    this._filterComponent = new FilterView(filters, this._currentFilter, this._statsComponent);


    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      this._initStatsComponent();
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
    this._initStatsComponent();

  }

  _initStatsComponent() {
    const mainNavigationElement = this._filterContainer.querySelector(`.main-navigation`);
    render(mainNavigationElement, this._statsComponent);
  }

  _handleModelEvent() {
    const changeMenuItem = this._changeMenuItem;
    this.init();
    this.setClickHandler(changeMenuItem);
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType || filterType === undefined) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, UpdateType.NOT, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return Object.keys(FilterType).map((filterType) => {
      return {
        type: FilterType[filterType],
        name: ucFirst(FilterType[filterType]),
        count: filter[FilterType[filterType]](movies).length
      };
    });
  }

  setClickHandler(callback) {
    this._filterComponent.setFilterClikHandler(callback);
    this._statsComponent.setClickHandler(callback);
    this._changeMenuItem = callback;
  }

  setActiveMenuItem(menuItem) {
    switch (menuItem) {
      case MenuItem.MOVIES:
        this._statsComponent.removeActiveMenuElement();
        break;
      case MenuItem.STATISTICS:
        this._filterModel.setFilter(UpdateType.MAJOR, UpdateType.NOT, null);
        this._statsComponent.setActiveMenuElement();
        break;
    }
  }

}
