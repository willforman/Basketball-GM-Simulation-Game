import fetchData from "./fetchData";

// gets names for league
export default class NameGen {
  private firstNames: string[];
  private lastNames: string[];

  private async init() {
    const fnURL =
      "https://raw.githubusercontent.com/aruljohn/popular-baby-names/master/2000/boy_names_2000.json";
    const fnResponse = await fetchData(fnURL);

    this.firstNames = fnResponse.names;

    const lnURL =
      "https://raw.githubusercontent.com/terryweiss/ink-collector/master/tests/nottests/last.names.json";
    const lnResponse = await fetchData(lnURL);

    this.lastNames = lnResponse.slice(0, 1000); // takes only the first 1000 names
  }

  static async build() {
    const ng = new NameGen();
    await ng.init();
    return ng;
  }

  getName() {
    const fn = this.getFirstName();
    const ln = this.getLastName();

    return `${fn} ${ln}`;
  }

  // picks random first name
  private getFirstName(): String {
    return this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
  }

  // picks random last name
  private getLastName(): String {
    return this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
  }
}
