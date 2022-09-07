import ComponentView, {html} from './component-view.js';

export default class PriceInputView extends ComponentView {
  constructor(value) {
    super(value);

    this.classList.add('event__field-group', 'event__field-group--price');
  }

  /**
   * @override
   * @param {number} value
   */
  createAdjacentHtml(value) {
    return html`
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price"
      title="Введите целое положительное чило"
      pattern="^[0-9]+$"
      id="event-price-1"
      type="text"
      name="event-price"
      value="${value}">
    `;
  }
}

customElements.define(String(PriceInputView), PriceInputView);
