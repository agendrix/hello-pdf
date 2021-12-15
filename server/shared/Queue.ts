import Queue from "bull";

import HtmlDocument from "./HtmlDocument";

const ServiceQueue = new Queue<HtmlDocument>("documents", process.env.REDIS_URL!);

export default ServiceQueue;
