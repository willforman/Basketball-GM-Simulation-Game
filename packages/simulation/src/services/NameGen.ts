import fetchData from "./fetchData";

interface FirstNameResponse {
  year: number;
  names: string[];
}

// gets names for league
export default class NameGen {
  private firstNames: string[];
  private lastNames: string[];

  private async init() {
    const fnURL =
      "https://raw.githubusercontent.com/aruljohn/popular-baby-names/master/2000/boy_names_2000.json";
    const fnResponse = await fetchData<FirstNameResponse>(fnURL);

    this.firstNames = fnResponse.payload.names;

    const lnURL =
      "https://raw.githubusercontent.com/terryweiss/ink-collector/master/tests/nottests/last.names.json";
    const lnResponse = await fetchData<string[]>(lnURL);

    this.lastNames = lnResponse.payload.slice(0, 1000); // takes only the first 1000 names
  }

  static async build(): Promise<NameGen> {
    const ng = new NameGen();
    await ng.init();
    return ng;
  }

  // return random first name and last name
  getName(): string {
    const fName = this.getRandElem(this.firstNames);
    const lName = this.getRandElem(this.lastNames);

    return `${fName} ${lName}`;
  }

  // gets random name from array
  private getRandElem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
