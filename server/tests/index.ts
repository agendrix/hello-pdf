import FormData from "form-data";

const payload = {
  body: "<p>allo</p>",
  header: "header",
  footer: "footer",
  filename: "filename",
};

const form = new FormData();
Object.entries(payload).forEach(([key, value]) => form.append(key, value));

form.submit("http://localhost:4000/convert", function(err, res) {
  const data: Array<any> = [];
  res.on("data", chunk => {
    data.push(chunk);
  });
  
  res.on("end", () => console.log((Buffer.concat(data).toString())));
});

