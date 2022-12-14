import Enum from './enum';

export default class FilterPredicate extends Enum {
  /**
   * @type {Predicate<PointAdapter>}
   */
  static EVERYTHING = () => true;

  /**
   * @type {Predicate<PointAdapter>}
   */
  static FUTURE = (point) => Date.parse(point.startDate) >= Date.now();
}
