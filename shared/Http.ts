import http from "http";
import https from "https";

type HttpResponse = {
  statusCode: number | undefined;
  data: Buffer;
};

async function request(uri: string, method: string, payload: string | Buffer, contentType: string): Promise<HttpResponse> {
  const client = new URL(uri).protocol === "https:" ? https : http;
  const options = {
    method: method,
    headers: {
      "Content-Type": contentType,
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const request = client.request(uri, options, (res) => {
      const data: Array<any> = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });

      res.on("end", () => resolve({ statusCode: res.statusCode, data: Buffer.concat(data) }));
    });

    request.on("error", reject);
    request.write(payload, () => request.end());
  });
}

export function post(uri: string, data: Object | string, contentType: string = "application/json") {
  if (data instanceof Object && contentType === "application/json") {
    data = JSON.stringify(data);
  }

  return request(uri, "POST", data as string, contentType);
}

export function put(uri: string, data: Object | string, contentType: string = "application/json") {
  if (data instanceof Object && contentType === "application/json") {
    data = JSON.stringify(data);
  }

  return request(uri, "PUT", data as string, contentType);
}