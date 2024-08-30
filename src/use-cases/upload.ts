import { MeasuresRepository } from "@/repositories/measures-repository";
import { $Enums, Measure } from "@prisma/client";
import { isSameMonth } from "date-fns";
import { DoubleMeasureError } from "./errors/double-measure-error";

interface UploadUseCaseRequest {
  customer_code: string;
  measure_datetime: Date;
  measure_type: $Enums.Role;
  measure_value: number;
}

interface UploadUseCaseResponse {
  measure: Measure;
}

export class UploadUseCase {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({
    customer_code,
    measure_datetime,
    measure_type,
    measure_value,
  }: UploadUseCaseRequest): Promise<UploadUseCaseResponse> {
    const LastMeasureOfType = await this.measuresRepository.findFirstByType(
      measure_type
    );

    if (LastMeasureOfType) {
      const areMeasuresInSameMonth = isSameMonth(
        LastMeasureOfType.measure_datetime,
        measure_datetime
      );

      if (areMeasuresInSameMonth) {
        throw new DoubleMeasureError();
      }
    }

    const measure = await this.measuresRepository.upload({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value,
    });

    return { measure };
  }
}
