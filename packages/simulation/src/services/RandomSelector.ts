import Choice from "../models/Choice";

export default class RandomSelector {
  private sum: number;
  private choices: Choice[];

  constructor(choices: Choice[]) {
    this.choices = choices;

    this.sum = choices.reduce(
      (total: number, choice: Choice) => total + choice.weight,
      0
    );
  }

  getChoice(): any {
    const numGenerated = Math.floor(Math.random() * this.sum);

    let currTotal = 0;

    for (const choice of this.choices) {
      currTotal += choice.weight;
      if (currTotal > numGenerated) {
        return choice.item;
      }
    }
    throw Error("Couldn't select choice");
  }
}
