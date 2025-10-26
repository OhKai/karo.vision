import { FastifyInstance, FastifyReply } from "fastify";
import { Db } from "../../db/drizzle";
import { files } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createReadStream, ReadStream, promises as fs } from "node:fs";
import path from "node:path";
import mimeTypes from "mime-types";

export const fsRouter = (server: FastifyInstance, db: Db) => {
  server.get<{
    Params: { fileId: string };
    Querystring: { token?: string; download?: string };
    Headers: { range?: string };
    Reply: {
      200: ReadStream;
      206: ReadStream;
      302: { url: string };
      "4xx": { error: string };
      "5xx": { error: string };
    };
  }>("/files/:fileId", async (request, reply) => {
    const fileId = parseInt(request.params.fileId);
    // TODO: zod validation necessary? We don't really care about the type or value.
    const { token, download } = request.query;
    const { range } = request.headers;

    // Get the file from the database.
    const file = await db.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    // Error if file not found.
    if (!file) {
      return reply.code(404).send({ error: "File not found" });
    }

    try {
      // Get the Content-Type based on the file extension.
      const mime = mimeTypes.lookup(file.name) || "application/octet-stream";

      // CORS headers for media files in development only
      // In production, frontend and backend are same-origin so CORS isn't needed
      if (process.env.NODE_ENV === "development") {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Range");
      }

      // Check if file requested range.
      if (range) {
        return serveRangeFile(
          path.join(file.dirname, file.name),
          file.size,
          mime,
          range,
          reply,
        );
      }

      // Headers for non-range requests.
      reply.header("Content-Type", mime);
      reply.header(
        "Content-Disposition",
        `${download ? "attachment" : "inline"}; filename="${file.name}"`,
      );
      reply.header("Content-Length", file.size);
      if (mime.startsWith("video")) {
        reply.header("Accept-Ranges", "bytes");
      }

      // Stream the file.
      const stream = createReadStream(path.join(file.dirname, file.name));
      return reply.code(200).send(stream);
    } catch (error) {
      return reply.code(500).send({ error: "Error streaming file" });
    }
  });

  server.get<{
    Params: { fileId: string };
    Querystring: { token?: string };
    Reply: {
      200: ReadStream;
      302: { url: string };
      "4xx": { error: string };
      "5xx": { error: string };
    };
  }>("/files/:fileId/thumb", async (request, reply) => {
    const fileId = parseInt(request.params.fileId);
    // TODO: zod validation necessary? We don't really care about the type or value.
    const { token } = request.query;

    // Get the file from the database.
    const file = await db.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    // Error if file not found.
    if (!file) {
      return reply.code(404).send({ error: "File not found" });
    }

    try {
      // Get the thumbnail size.
      const thumbPath = path.join(file.dirname, ".hc_thumbs", file.id + ".png");
      const stats = await fs.stat(thumbPath);

      // Set headers.
      reply.header("Content-Type", "image/png");
      reply.header("Content-Length", stats.size);

      // Stream the file.
      const stream = createReadStream(thumbPath);
      return reply.code(200).send(stream);
    } catch (error) {
      return reply.code(500).send({ error: "Error streaming file" });
    }
  });
};

const rangeParse = (str: string) => {
  const token = str.split("=");

  if (!token || token.length != 2 || token[0] != "bytes") {
    return null;
  }

  return token[1]
    .split(",")
    .map((range) =>
      range.split("-").map((value) => {
        if (value === "") {
          return Infinity;
        }
        return Number(value);
      }),
    )
    .filter(
      (range) => !isNaN(range[0]) && !isNaN(range[1]) && range[0] <= range[1],
    );
};

// Inspired by koa-range
const serveRangeFile = async (
  filePath: string,
  size: number,
  mime: string,
  range: string,
  reply: FastifyReply<{
    Reply: {
      206: ReadStream;
      "4xx": {
        error: string;
      };
    };
  }>,
) => {
  const ranges = rangeParse(range);

  if (!ranges || ranges.length == 0) {
    return reply.code(416).send({ error: "Invalid range" });
  }

  // Avoid multi ranges.
  const firstRange = ranges[0];
  const start = firstRange[0];
  let end = firstRange[1];

  const fileStream = createReadStream(filePath, {
    start,
    end: end + 1,
  });

  // Adjust infinite end.
  if (end === Infinity) {
    end = size - 1;
  }

  reply.header("Content-Range", `bytes ${start}-${end}/${size}`);
  reply.header("Accept-Ranges", "bytes");
  reply.header("Content-Length", end - start + 1);
  reply.header("Content-Type", mime);

  return reply.code(206).send(fileStream);
};
