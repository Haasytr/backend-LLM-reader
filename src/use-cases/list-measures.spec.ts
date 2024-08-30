import { expect, describe, it, beforeEach } from "vitest";
import { DoubleMeasureError } from "./errors/double-measure-error";
import { InMemoryMeasuresRepository } from "../repositories/in-memory/in-memory-measures-repository";
import { MeasureNotFoundError } from "./errors/measure-not-found-error";
import { ListMeasuresUseCase } from "./list-measures";
import { InvalidTypeError } from "./errors/invalid-type-error";

let measureRepository: InMemoryMeasuresRepository;
let sut: ListMeasuresUseCase;

describe("List measure Use Case", () => {
  beforeEach(() => {
    measureRepository = new InMemoryMeasuresRepository();
    sut = new ListMeasuresUseCase(measureRepository);
  });
  it("should be able to list measures", async () => {
    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    const { measures } = await sut.execute({
      id: "123",
    });

    expect(measures.length).toEqual(2);
  });

  it("should be able to list only water measures", async () => {
    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "GAS",
      measure_value: 11,
    });

    const { measures } = await sut.execute({
      id: "123",
      param: "GAS",
    });

    expect(measures.length).toEqual(1);
  });

  it("should not be able to list with invalid param", async () => {
    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "WATER",
      measure_value: 11,
    });

    await measureRepository.upload({
      customer_code: "123",
      measure_datetime: new Date(),
      measure_type: "GAS",
      measure_value: 11,
    });

    await expect(() =>
      sut.execute({
        param: "ERROR",
        id: "123",
      })
    ).rejects.toBeInstanceOf(InvalidTypeError);
  });
});
