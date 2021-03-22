export class CapSpace {
  private _capacity: number;
  private _currPay: number;

  constructor(currPay: number, capacity: number) {
    this._capacity = capacity;
    this._currPay = currPay;
  }

  add(addCap: number): void {
    this._currPay += addCap;
  }

  canAdd(addCap: number): boolean {
    return this._currPay + addCap <= this._capacity;
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
