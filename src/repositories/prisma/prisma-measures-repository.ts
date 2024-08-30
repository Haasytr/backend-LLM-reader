import { Prisma, Measure, $Enums } from "@prisma/client";
import { MeasuresRepository } from "../measures-repository";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export class PrismaMeasuresRepository implements MeasuresRepository {
  async update(id: string, confirmed_value: number): Promise<Measure> {
    return prisma.measure.update({
      where: {
        id,
      },
      data: {
        measure_value: confirmed_value,
        confirmed: true,
      },
    });
  }
  async upload(data: Prisma.MeasureCreateInput): Promise<Measure> {
    const measure = await prisma.measure.create({
      data,
    });
    return measure;
  }

  list(id: string, param?: $Enums.Role): Promise<Measure[] | null> {
    return prisma.measure.findMany({
      where: {
        measure_type: param,
        customer_code: id,
      },
    });
  }

  findById(id: string): Promise<Measure | null> {
    return prisma.measure.findUnique({
      where: {
        id,
      },
    });
  }

  async findFirstByType(type: $Enums.Role): Promise<Measure | null> {
    const measure = await prisma.measure.findFirst({
      where: {
        measure_type: type,
      },
    });

    if (!measure) {
      return null;
    }

    return measure;
  }
}
