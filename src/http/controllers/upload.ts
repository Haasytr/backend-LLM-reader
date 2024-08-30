import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

import { makeUploadUseCase } from "@/use-cases/factories/make-upload-use-case";
import { Base64 } from "js-base64";
import { model } from "@/lib/google";
import { UploadBase64Image } from "@/utils/generatePart";
import fs from "fs";
import { randomUUID } from "crypto";
import { InvalidDataError } from "@/use-cases/errors/invalid_data-error";

export async function upload(req: FastifyRequest, res: FastifyReply) {
  const uploadMeasureSchema = z.object({
    image: z.string(),
    customer_code: z.string(),
    measure_datetime: z.string().datetime(),
    measure_type: z.enum(["WATER", "GAS"]),
  });

  const { image, customer_code, measure_datetime, measure_type } =
    uploadMeasureSchema.parse(req.body);

  if (!Base64.isValid(image)) {
    throw new InvalidDataError();
  }

  const uploadUseCase = makeUploadUseCase();

  try {
    const mimeType = image.split(";")[0].split("/")[1];
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const path = `uploads/temp-${randomUUID()}.jpg`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: `image/${mimeType}`,
          data: base64Data,
        },
      },
      { text: "write only numbers, return me the measure in decimals" },
    ]);

    const uploadedFile = await UploadBase64Image(base64Data, mimeType, path);

    console.log(uploadedFile);

    fs.unlink(path, (err) => {
      return err;
    });

    const measure_value = Number(result.response.text());

    const measure = await uploadUseCase.execute({
      customer_code,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      measure_value,
    });

    return res.status(200).send({ image_url: uploadedFile?.uri, measure });
  } catch (err) {
    return res.status(500).send(err);
  }
}
