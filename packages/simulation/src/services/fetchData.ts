import fetch from "node-fetch";

export default async (url: string): Promise<Response> => {
  const response = await fetch(url);

  let body: Response;

  try {
    // may error if there is no body
    body = await response.json();
  } catch (ex) {
    throw new Error(ex);
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return body;
};
