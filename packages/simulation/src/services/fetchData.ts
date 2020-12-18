import fetch from "node-fetch";

interface ResponseGeneric<ResponseStructure> {
  payload: ResponseStructure;
}

export default async <ResponseStructure>(
  url: string
): Promise<ResponseGeneric<ResponseStructure>> => {
  const response = await fetch(url);

  let body: ResponseStructure;

  try {
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
