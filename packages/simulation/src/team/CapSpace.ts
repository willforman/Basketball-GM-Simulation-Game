export default class CapSpace {
  private _capacity: number;
  private _currPay: number;

  constructor(capacity: number, currPay: number) {
    this._capacity = capacity;
    this._currPay = currPay;
  }

  add(addCap: number): boolean {
    if (this._currPay + addCap > this._capacity) {
      return false;
    }
    this._currPay += addCap;
    return true;
  }

  remove(removeCap: number): void {
    this._currPay -= removeCap;
  }

  get capacity(): number {
    return this._capacity;
  }

  get currPay(): number {
    return this._currPay;
  }
}
