import Enum from './enum';
/** @typedef {import('../adapter/point-adapter').default} PointAdapter */

export default class SortCompare extends Enum {
  /**
   * @param {PointAdapter} pointA
   * @param {PointAdapter} pointB
   */
  static DAY = (pointA, pointB) => Date.parse(pointA.startDate) - Date.parse(pointB.startDate);
  static PRICE = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
}