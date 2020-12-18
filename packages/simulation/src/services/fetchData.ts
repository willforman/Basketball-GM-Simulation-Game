import fetch from "node-fetch";

export default async (url: string) => {
  try {
    const data = await fetch(url);
    return data.json();
  } catch (err) {
    console.error("Couldn't fetch data: ", err);
  }
};
