import https from "https"

export async function post(uri: string, data: Object) {
  const payload = JSON.stringify(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    request.write(data);
    request.end();
  });
}

