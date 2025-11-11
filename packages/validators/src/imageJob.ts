import z from "zod";

function BytesToMb(input: number) {
  return input / 1024 / 1024;
}

export const MaxFileSize = 1024 * 1024 * 5;
const FileLimitMessage = `File must not be more than ${BytesToMb(MaxFileSize)}MB`;

const MulterFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  buffer: z.instanceof(Buffer),
});

const ImageSchema = z.union([
  z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
        ].includes(file.type),
      { message: "Invalid file type" },
    )
    .refine((file) => file.size <= MaxFileSize, {
      message: FileLimitMessage,
    }),
  MulterFileSchema.refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ].includes(file.mimetype),
    { message: "Invalid file type" },
  ).refine((file) => file.size <= MaxFileSize, {
    message: FileLimitMessage,
  }),

  z.string().refine((str) => str.startsWith("data:image/"), {
    message: "Invalid base64 image string",
  }),
]);

const ResizeSchema = z.object({
  width: z.string().transform((s) => parseInt(s)),
  height: z.string().transform((s) => parseInt(s)),
  action: z.literal("RESIZE"),
  image: ImageSchema,
});

const CompressSchema = z.object({
  action: z.literal("COMPRESS"),
  image: ImageSchema,
});

const ImageJobSchema = z.discriminatedUnion("action", [
  ResizeSchema,
  CompressSchema,
]);

export type ImageJob = z.infer<typeof ImageJobSchema>;

export function parseImage(data: unknown): ImageJob {
  return ImageJobSchema.parse(data);
}
