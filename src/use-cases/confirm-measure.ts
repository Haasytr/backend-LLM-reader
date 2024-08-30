import { Measure } from "@prisma/client";

import { MeasuresRepository } from "@/repositories/measures-repository";
import { MeasureNotFoundError } from "./errors/measure-not-found-error";
import { DoubleMeasureError } from "./errors/double-measure-error";

interface ConfirmMeasureUseCaseRequest {
  measure_uuid: string;
  confirmed_value: number;
}

interface ConfirmMeasureUseCaseResponse {
  success: boolean;
}

export class ConfirmMeasureUseCase {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({
    confirmed_value,
    measure_uuid,
  }: ConfirmMeasureUseCaseRequest): Promise<ConfirmMeasureUseCaseResponse> {
    const ExistingMeasure = await this.measuresRepository.findById(
      measure_uuid
    );

    if (!ExistingMeasure) {
      throw new MeasureNotFoundError();
    }

    if (ExistingMeasure.confirmed == true) {
      throw new DoubleMeasureError();
    }

    const measure = await this.measuresRepository.update(
      measure_uuid,
      confirmed_value
    );

    return { success: true };
  }
}
