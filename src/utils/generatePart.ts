import { fileManager } from "@/lib/google";
import fs from "fs";

export async function UploadBase64Image(
  base64: string,
  mimeType: string,
  path: string
) {
  try {
    fs.writeFile(path, base64, "base64", () => {});

    const { file } = await fileManager.uploadFile(path, {
      mimeType,
      displayName: "measurer",
    });

    return file;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}
