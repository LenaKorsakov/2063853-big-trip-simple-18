import Presenter from './presenter';
import PointType from '../enum/point-type';
import PointLabel from '../enum/point-label';
import Mode from '../enum/mode';
import DatePickerView from '../view/date-picker-view';
import {escape} from 'he';

DatePickerView.setDefaults({
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  locale: {firstDayOfWeek: 1, 'time_24hr': true}
});

/**
 * @template {ApplicationModel} Model
 * @template {CreatorView} View
 * @extends Presenter<Model,View>
 */
export default class CreatorPresenter extends Presenter {
  /**
   * @param {[model: Model, view: View]} init
   */
  constructor(...init) {
    super(...init);

    this._buildView();

    this.view.addEventListener('close', this.#onViewClose.bind(this));
    this.view.addEventListener('submit', this._onViewSubmit.bind(this));
    this.view.addEventListener('reset', this._onViewReset.bind(this));

    this.view.pointTypeSelectView.addEventListener('change', this.#onPointTypeSelectViewChange.bind(this));
    this.view.destinationSelectView.addEventListener('change', this.#onDestinationSelectViewChange.bind(this));
    this.view.datePickerView.addEventListener('change', this.#onDatePickerViewChange.bind(this));
    this.view.priceInputView.addEventListener('change', this.#onPriceInputViewChange.bind(this));
    this.view.offerSelectView.addEventListener('change', this.#onOffersSelectViewChange.bind(this));

    this.model.addEventListener('mode', this._onModelMode.bind(this));
  }

  _buildView() {
    /** @type {PointTypeOptionState[]} */
    const pointTypeOptionStates = Object.keys(PointType).map((key) => [PointLabel[key], PointType[key]]);

    /** @type {DestinationOptionState[]} */
    const destinationOptionStates = this.model.destinationsModel.listAll().map((item) => [
      '',
      escape(item.name)
    ]);

    this.view.pointTypeSelectView.setOptions(pointTypeOptionStates);
    this.view.destinationSelectView.setOptions(destinationOptionStates);

    this.view.datePickerView.configure({
      onChange: [(dates) => {
        const [minDate] = dates;

        this.view.datePickerView.configure({}, {minDate});
      }]
    }, {
      onValueUpdate: [() => {
        const [startDate, endDate = startDate] = this.view.datePickerView.getDates();

        this.view.datePickerView.setDates(startDate, endDate, false);
      }]
    });
  }

  _updateView() {
    const point = this.model.currentPoint;

    this.view.pointTypeSelectView.setValue(point.type);

    this.view.destinationSelectView
      .setValue(this.model.destinationsModel.findById(point.destinationId).name)
      .setLabel(PointLabel[PointType.findKey(point.type)]);

    this.view.datePickerView.setDates(point.startDate, point.endDate);

    this.view.priceInputView.setPrice(String(point.basePrice));

    this._updateOfferSelectView();
    this._updateDestinationView();
  }

  _updateOfferSelectView(check = true) {
    const selectedType = this.view.pointTypeSelectView.getValue();
    const availableOffers = this.model.offerGroupsModel.findById(selectedType).items;

    /** @type {OfferOptionState[]} */
    const offers = availableOffers.map((offer) => [
      escape(offer.title),
      escape(String(offer.price)),
      escape(offer.id),
      check && this.model.currentPoint.offerIds.includes(offer.id)
    ]);

    this.view.offerSelectView
      .display(Boolean(availableOffers.length))
      .setOptions(offers);
  }

  _updateDestinationView() {
    const destination = this.model.destinationsModel.findBy(
      'name',
      this.view.destinationSelectView.getValue()
    );
    /** @type {DestinationPictureState[]} */
    const pictureStates = destination.pictures.map((picture) => [
      escape(picture.src),
      escape(picture.description),
    ]);


    this.view.destinationView
      .setPictures(pictureStates)
      .setDescription(destination.description);
  }

  _saveCurrentPoint() {
    return this.model.pointsModel.add(this.model.currentPoint);

  }

  async _onViewSubmit(event) {
    event.preventDefault();

    this.view.setSaving(true);

    try {
      await this._saveCurrentPoint();
      this.view.close();
    }

    catch (exception) {
      this.view.shake();
    }

    this.view.setSaving(false);
  }

  /**
   * @param {Event} event
   */
  _onViewReset(event) {
    event.preventDefault();

    this.view.close();
  }

  _onModelMode() {
    this.view.close(false);

    if (this.model.getMode() === Mode.CREATE) {
      this._updateView();

      this.view.open();
    }
  }

  #onViewClose() {
    this.model.setMode(Mode.VIEW);
  }

  #onPointTypeSelectViewChange() {
    const pointType = this.view.pointTypeSelectView.getValue();
    const key = PointType.findKey(pointType);

    this.model.currentPoint.type = pointType;

    this.view.destinationSelectView.setLabel(PointLabel[key]);
    this._updateOfferSelectView();
  }

  #onDestinationSelectViewChange() {
    const destinationName = this.view.destinationSelectView.getValue();
    const destination = this.model.destinationsModel.findBy('name', destinationName);

    this.model.currentPoint.destinationId = destination?.id;

    this._updateDestinationView();
  }

  #onDatePickerViewChange() {
    const [startDate, endDate] = this.view.datePickerView.getDates();

    Object.assign(this.model.currentPoint, {startDate, endDate});
  }

  #onPriceInputViewChange() {
    this.model.currentPoint.basePrice = Number(this.view.priceInputView.getPrice());
  }

  #onOffersSelectViewChange() {
    this.model.currentPoint.offerIds = this.view.offerSelectView.getSelectedValues();
  }
}
