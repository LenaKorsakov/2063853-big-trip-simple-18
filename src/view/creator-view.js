import View, {html} from './view';
import PointTypeSelectView from './point-type-select-view';
import DestinationSelectView from './destination-select-view';
import DatePickerView from './date-picker-view';
import PriceInputView from './price-input-view';
import OfferSelectView from './offer-select-view';
import DestinationView from './destination-view';
import SaveButtonLabel from '../enum/save-button-label';

/**
 * @implements EventListenerObject
 */
export default class CreatorView extends View {
  _targetView = null;

  constructor() {
    super();

    this.classList.add('trip-events__item');

    /** @type {PointTypeSelectView} */
    this.pointTypeSelectView = this.querySelector(String(PointTypeSelectView));

    /** @type {DestinationSelectView} */
    this.destinationSelectView = this.querySelector(String(DestinationSelectView));

    /** @type {DatePickerView} */
    this.datePickerView = this.querySelector(String(DatePickerView));

    /** @type {PriceInputView} */
    this.priceInputView = this.querySelector(String(PriceInputView));

    /** @type {OfferSelectView} */
    this.offerSelectView = this.querySelector(String(OfferSelectView));

    /** @type {DestinationView} */
    this.destinationView = this.querySelector(String(DestinationView));

    this.addEventListener('submit', this._onSubmit);
    this.addEventListener('reset', this._onReset);
  }

  /**
   * @override
   */
  createAdjacentHtml() {
    return html`
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${PointTypeSelectView}
          ${DestinationSelectView}
          </div>
          ${DatePickerView}
          ${PriceInputView}
          ${this.createButtonsHtml()}
        </header>
        <section class="event__details">
          ${OfferSelectView}
          ${DestinationView}
        </section>
      </form>
    `;
  }

  createButtonsHtml() {
    return html`
      <button class="event__save-btn  btn  btn--blue" type="submit">
        ${SaveButtonLabel.DEFAULT}
      </button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    `;
  }

  /**
   * @param {boolean} flag
   */
  setSaveButtonPressed(flag) {
    /** @type {HTMLButtonElement} */
    const view = this.querySelector('.event__save-btn');

    view.disabled = flag;
    view.textContent = flag ? SaveButtonLabel.PRESSED : SaveButtonLabel.DEFAULT;
  }

  /**
   * @param {boolean} flag
   */
  setFormDisabled(flag) {
    /** @type {HTMLFormElement[]} */
    const views = Array.from(...this.children);

    views.forEach((view) => {
      view.disabled = flag;
    });
  }

  /**
   * @param {HTMLElement} view
   */
  target(view) {
    this._targetView = view;

    return this;
  }

  /**
   * @override
   * @param {boolean} flag
   */
  display(flag) {
    if (flag) {
      this._targetView.prepend(this);
    } else {
      this.remove();
    }

    return this;
  }

  open() {
    this.display(true);

    document.addEventListener('keydown', this);

    return this;
  }

  close(notify = true) {
    this.display(false);

    document.removeEventListener('keydown', this);

    if (notify) {
      this.dispatchEvent(new CustomEvent('close'));
    }

    return this;
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleEvent(event) {
    if (event.key?.startsWith('Esc')) {
      this.close();
    }
  }

  _onSubmit(event) {
    event.preventDefault();
  }

  _onReset(event) {
    event.preventDefault();

    this.close();
  }
}

customElements.define(String(CreatorView), CreatorView);
