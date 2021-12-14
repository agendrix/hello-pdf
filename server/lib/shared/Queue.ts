import Queue from "bull";
import HtmlDocument from "./HtmlDocument";

const ServiceQueue = new Queue<HtmlDocument>("documents", 'redis://127.0.0.1:6479');

export default ServiceQueue;
