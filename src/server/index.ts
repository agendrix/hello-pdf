import { Logger } from "../lib";
import app from "./app";

const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger.log(`Running an API server listening on port ${port}`);
