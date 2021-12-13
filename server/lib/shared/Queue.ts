import Queue from "bull";

const queue = new Queue("documents", 'redis://127.0.0.1:6479');

export default queue;
