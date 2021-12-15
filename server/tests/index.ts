import FormData from "form-data";
import { writeFileSync } from "fs";

const payload = {
  body: "<p>allo</p>",
  header: "header",
  footer: "footer",
  filename: "filename",
};

const form = new FormData();
Object.entries(payload).forEach(([key, value]) => form.append(key, value));

form.submit("http://localhost:4000/convert", function (_err, res) {
  const data: Array<any> = [];
  res.on("data", (chunk) => {
    data.push(chunk);
  });

  res.on("end", () => {
    writeFileSync(`tests/${payload.filename}.pdf`, Buffer.concat(data));
  });
});
