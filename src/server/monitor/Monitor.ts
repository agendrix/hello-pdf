import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

import { Queue } from "../../lib";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/monitor");

createBullBoard({
  queues: [new BullAdapter(Queue, { readOnlyMode: true })],
  serverAdapter: serverAdapter,
});

export default serverAdapter.getRouter();
