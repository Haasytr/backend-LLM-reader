import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

import { makeListMeasuresUseCase } from "@/use-cases/factories/make-list-use-case";

export async function list(req: FastifyRequest, res: FastifyReply) {
  const listMeasureSchema = z.object({
    customer_code: z.string(),
  });

  const listMeasureQuerySchema = z.object({
    measure_type: z.string().optional(),
  });

  const { customer_code } = listMeasureSchema.parse(req.params);
  const { measure_type } = listMeasureQuerySchema.parse(req.query);

  const confirmMeasureUseCase = makeListMeasuresUseCase();

  try {
    const { measures } = await confirmMeasureUseCase.execute({
      id: customer_code,
      param: measure_type,
    });

    return res.status(200).send({ customer_code: customer_code, measures });
  } catch (err) {
    return err;
  }
}
