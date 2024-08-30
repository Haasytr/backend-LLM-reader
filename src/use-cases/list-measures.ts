import { MeasuresRepository } from "@/repositories/measures-repository";
import { Measure } from "@prisma/client";
import { MeasuresNotFoundError } from "./errors/measures-not-found-error";
import { InvalidTypeError } from "./errors/invalid-type-error";

interface ListMeasuresUseCaseRequest {
  param?: string;
  id: string;
}

interface ListMeasuresUseCaseResponse {
  measures: Measure[];
}

export class ListMeasuresUseCase {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({
    param,
    id,
  }: ListMeasuresUseCaseRequest): Promise<ListMeasuresUseCaseResponse> {
    if (!param) {
      const measures = await this.measuresRepository.list(id);
      if (!measures) {
        throw new MeasuresNotFoundError();
      }
      return { measures };
    }

    if (param !== "WATER" && param !== "GAS") {
      throw new InvalidTypeError();
    }

    const measures = await this.measuresRepository.list(id, param);
    if (!measures) {
      throw new MeasuresNotFoundError();
    }
    return { measures };
  }
}
