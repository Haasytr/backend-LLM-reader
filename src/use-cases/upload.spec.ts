import { expect, describe, it, beforeEach } from "vitest";
import { UploadUseCase } from "./upload";
import { DoubleMeasureError } from "./errors/double-measure-error";
import { InMemoryMeasuresRepository } from "../repositories/in-memory/in-memory-measures-repository";

let measureRepository: InMemoryMeasuresRepository;
let sut: UploadUseCase;

describe("Upload Use Case", () => {
  beforeEach(() => {
    measureRepository = new InMemoryMeasuresRepository();
    sut = new UploadUseCase(measureRepository);
  });
  it("should be able to create a measure", async () => {
    const { measure } = await sut.execute({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 44,
    });

    expect(measure.id).toEqual(expect.any(String));
  });

  it("should not be able to measure if it has already been measured in the month", async () => {
    await sut.execute({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 44,
    });

    await expect(() =>
      sut.execute({
        customer_code: "123",
        measure_datetime: new Date(),
        measure_type: "WATER",
        measure_value: 44,
      })
    ).rejects.toBeInstanceOf(DoubleMeasureError);
  });
});
