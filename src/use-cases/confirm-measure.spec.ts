import { expect, describe, it, beforeEach } from "vitest";
import { UploadUseCase } from "./upload";
import { DoubleMeasureError } from "./errors/double-measure-error";
import { InMemoryMeasuresRepository } from "../repositories/in-memory/in-memory-measures-repository";
import { ConfirmMeasureUseCase } from "./confirm-measure";
import { MeasureNotFoundError } from "./errors/measure-not-found-error";

let measureRepository: InMemoryMeasuresRepository;
let sut: ConfirmMeasureUseCase;

describe("Confirm measure Use Case", () => {
  beforeEach(() => {
    measureRepository = new InMemoryMeasuresRepository();
    sut = new ConfirmMeasureUseCase(measureRepository);
  });
  it("should be able to confirm a measure value", async () => {
    const { id } = await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    const { success } = await sut.execute({
      confirmed_value: 44,
      measure_uuid: id,
    });

    expect(success).toEqual(true);
  });

  it("should not be able to confirm again", async () => {
    const { id } = await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    await sut.execute({
      confirmed_value: 44,
      measure_uuid: id,
    });

    await expect(() =>
      sut.execute({
        confirmed_value: 44,
        measure_uuid: id,
      })
    ).rejects.toBeInstanceOf(DoubleMeasureError);
  });

  it("should not be able to confirm again", async () => {
    await expect(() =>
      sut.execute({
        confirmed_value: 44,
        measure_uuid: "123",
      })
    ).rejects.toBeInstanceOf(MeasureNotFoundError);
  });
});
