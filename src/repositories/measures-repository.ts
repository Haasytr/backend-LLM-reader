import { Prisma, Measure, $Enums } from "@prisma/client";

export interface MeasuresRepository {
  upload(data: Prisma.MeasureCreateInput): Promise<Measure>;
  findFirstByType(type: $Enums.Role): Promise<Measure | null>;
  findById(id: string): Promise<Measure | null>;
  update(id: string, confirmed_value: number): Promise<Measure>;
  list(id: string, param?: string): Promise<Measure[] | null>;
}
