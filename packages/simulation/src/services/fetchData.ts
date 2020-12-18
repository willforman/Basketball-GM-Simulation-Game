import fetch from "node-fetch";

interface ResponseGeneric<T> {
  payload: T;
}

export default async <T>(url: string): Promise<ResponseGeneric<T>> => {
  const response = await fetch(url);

  let body: T;

  try {
    // may error if there is no body
    body = await response.json();
  } catch (ex) {
    throw new Error(ex);
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return {
    payload: body,
  };
};
