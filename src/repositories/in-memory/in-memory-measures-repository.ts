import { Prisma, Measure } from "@prisma/client";
import { MeasuresRepository } from "../measures-repository";
import { randomUUID } from "node:crypto";

export class InMemoryMeasuresRepository implements MeasuresRepository {
  public items: Measure[] = [];

  async upload(data: Prisma.MeasureCreateInput): Promise<Measure> {
    const measure = {
      id: randomUUID(),
      customer_code: data.customer_code,
      measure_datetime: new Date(data.measure_datetime),
      measure_type: data.measure_type,
      measure_value: data.measure_value,
      confirmed: false,
    };

    this.items.push(measure);

    return measure;
  }

  async findById(id: string): Promise<Measure | null> {
    const measure = this.items.find((item) => item.id === id);

    if (!measure) {
      return null;
    }

    return measure;
  }

  async list(id: string, param: string): Promise<Measure[] | null> {
    const measures = this.items.filter(
      (measure) => measure.customer_code === id
    );

    if (param) {
      return measures.filter((measure) => measure.measure_type == param);
    }

    return measures;
  }

  async update(id: string, confirmed_value: number): Promise<Measure> {
    const measure = this.items.find((item) => item.id === id);

    if (!measure) {
      throw new Error("Measure not found");
    }

    measure.measure_value = confirmed_value;
    measure.confirmed = true;

    return measure;
  }

  async findFirstByType(type: string): Promise<Measure | null> {
    const measure = this.items.find((item) => item.measure_type === type);

    if (!measure) {
      return null;
    }

    return measure;
  }
}
