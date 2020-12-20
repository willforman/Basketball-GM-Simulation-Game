import Choice from "../models/Choice";

export default class RandomSelector<T> {
  private sum: number;
  private choices: Choice<T>[];

  constructor(choices: Choice<T>[]) {
    if (!choices) {
      console.error(choices);
      throw new Error(`Invalid choices given`);
    }

    this.choices = choices;

    this.sum = choices.reduce(
      (total: number, choice: Choice<T>) => total + choice.weight,
      0
    );
  }

  getChoice = (): T => {
    const numGenerated = Math.floor(Math.random() * this.sum);

    let currTotal = 0;

    for (const choice of this.choices) {
      currTotal += choice.weight;
      if (currTotal > numGenerated) {
        return choice.item;
      }
    }
    throw new Error("Couldn't find choice");
  };
}
