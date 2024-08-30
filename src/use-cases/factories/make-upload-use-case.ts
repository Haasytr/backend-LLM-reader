import { PrismaMeasuresRepository } from "@/repositories/prisma/prisma-measures-repository";
import { UploadUseCase } from "../upload";

export function makeUploadUseCase() {
  const measuresRepository = new PrismaMeasuresRepository();
  const uploadUseCase = new UploadUseCase(measuresRepository);

  return uploadUseCase;
}
