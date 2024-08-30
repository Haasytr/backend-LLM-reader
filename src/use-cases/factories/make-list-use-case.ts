import { PrismaMeasuresRepository } from "@/repositories/prisma/prisma-measures-repository";
import { ListMeasuresUseCase } from "../list-measures";

export function makeListMeasuresUseCase() {
  const measuresRepository = new PrismaMeasuresRepository();
  const listMeasuresUseCase = new ListMeasuresUseCase(measuresRepository);

  return listMeasuresUseCase;
}
