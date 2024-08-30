import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

import { makeConfirmMeasureUseCase } from "@/use-cases/factories/make-confirm-measure-use-case";

export async function confirm(req: FastifyRequest, res: FastifyReply) {
  const confirmMeasureSchema = z.object({
    measure_uuid: z.string(),
    confirmed_value: z.number(),
  });

  const { confirmed_value, measure_uuid } = confirmMeasureSchema.parse(
    req.body
  );

  const confirmMeasureUseCase = makeConfirmMeasureUseCase();

  try {
    const { success } = await confirmMeasureUseCase.execute({
      confirmed_value,
      measure_uuid,
    });

    return res.status(200).send(success);
  } catch (err) {
    return err;
  }
}
