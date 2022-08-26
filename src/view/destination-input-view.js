import ComponentView, {html} from './component-view.js';

export default class DestinationInputView extends ComponentView {
  constructor() {
    super(...arguments);

    this.classList.add('event__field-group', 'event__field-group--destination');
    this.addEventListener('change', this.onChange);
  }

  /**
   * @override
   */
  createAdjacentHtml() {
    return html`
      <label class="event__label  event__type-output" for="event-destination-1">

    </label>
    <input class="event__input  event__input--destination"
      id="event-destination-1"
      type="text"
      name="event-destination"
      value=""
      list="destination-list-1">

      <datalist id="destination-list-1">
      <!--options-->
      </datalist>

    </input>
    `;
  }

  setLabel(label) {
    this.querySelector('.event__label').textContent = label;
  }

  /**
   * @param {string[]} destinations
   */
  setOptions(destinations) {
    const views = destinations.map((destination) => this.createOption(destination));
    this.querySelector('datalist').replaceChildren(...views);

    return this;
  }

  /**
   * @param {string} destination
   */
  createOption(destination) {
    const option = new Option();
    option.value = destination;

    return option;
  }

  /**
   * @param {string} destination
   */
  select(destination) {
    this.querySelector('input').value = destination;

    return this;
  }

  /**
   * @param {Event & {target: HTMLInputElement}} event
   */
  onChange(event) {
    const {value} = event.target;
    this.select(value);
    this.dispatchEvent(new CustomEvent('destinationChanged', {detail: {'value': value}}));
  }
}

customElements.define(String(DestinationInputView), DestinationInputView);