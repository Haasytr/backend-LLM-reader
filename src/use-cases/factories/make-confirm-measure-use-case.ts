import { PrismaMeasuresRepository } from "@/repositories/prisma/prisma-measures-repository";
import { ConfirmMeasureUseCase } from "../confirm-measure";

export function makeConfirmMeasureUseCase() {
  const measuresRepository = new PrismaMeasuresRepository();
  const confirmMeasureUseCase = new ConfirmMeasureUseCase(measuresRepository);

  return confirmMeasureUseCase;
}
