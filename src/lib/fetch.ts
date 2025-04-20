export async function fetchApi<T>(
  endpoint: string,
  parameters: any = {},
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any
): Promise<T> {
  let apiUrl = `https://dotaloregasm.com/api/${endpoint}`;

  if (Object.keys(parameters).length > 0 && parameters.returnFields) {
    const queryParams = new URLSearchParams();
    parameters.returnFields.forEach((field: string) =>
      queryParams.append("returnFields", field)
    );
    apiUrl = `https://dotaloregasm.com/api/${endpoint}?${queryParams.toString()}`;
  }

  const res = await fetch(apiUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
    },
    body:
      method === "POST" || method === "PUT" ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return res.json();
}
