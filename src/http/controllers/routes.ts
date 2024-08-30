import { FastifyInstance } from "fastify";

import { upload } from "./upload";
import { confirm } from "./confirm";
import { list } from "./list";

export async function Routes(app: FastifyInstance) {
  app.post("/upload", upload);

  app.patch("/confirm", confirm);

  app.get("/:customer_code/list", list);
}
