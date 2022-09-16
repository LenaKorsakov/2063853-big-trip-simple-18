import View from './view';
import PointView from './point-view';

export default class ListView extends View {
  constructor() {
    super(...arguments);

    this.classList.add('trip-events__list');
  }

  /**
   * @param {PointState[]} states
   */
  setPoints(states) {
    const views = states.map((state) => new PointView(state));

    this.replaceChildren(...views);

    return this;
  }

  findById(id) {
    return PointView.findById(id, this);
  }
}

customElements.define(String(ListView), ListView);
