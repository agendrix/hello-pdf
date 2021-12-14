import https from "https"

async function request(uri: string, method: string, payload:  string | Buffer, contentType: string) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(payload),
    }
  }
  
  return new Promise((resolve, reject) => {
    const request = https.request(uri, options, res => {
      const data: Array<any> = [];
      res.on("data", chunk => {
        data.push(chunk);
      });
      
      res.on("end", () => resolve(Buffer.concat(data).toString()));
    });
    
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

export function post(uri: string, data:  Object | string , contentType: string = "application/json") {
  if (data instanceof Object) {
    data = JSON.stringify(data);
  }

  return request(uri, "POST", data as string, contentType);
}

export function put(uri: string, data:  Object | string, contentType: string = "application/json") {
  if (data instanceof Object) {
    data = JSON.stringify(data);
  }

  return request(uri, "PUT", data as string, contentType);
}