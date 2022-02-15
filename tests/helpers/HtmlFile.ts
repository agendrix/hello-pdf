import { readFileSync } from "fs";

export default readFileSync(`${__dirname}/test.html`).toString();
