import type { Result } from "@karo-vision/home-cloud-frontend/lib/typescript-utils";
import {
  type File,
  generateVideoThumbnails,
  getFilesystemInfos,
  readFileMetadata,
  scanFolder,
} from "./fs";
import { result } from "@karo-vision/home-cloud-frontend/lib/utils";
import fs from "node:fs/promises";
import path from "node:path";
import type { Db } from "../db/drizzle";
import { files, music, photos, rootFolders, videos } from "../db/schema";
import { sql } from "drizzle-orm";
import pLimit from "p-limit";

export const initManager = async (db: Db) => {
  console.log("initManager");
  console.log(await addRootFolder(db, "/Users/karo/my-media/"));
};

export const addFile = async (
  db: Db,
  file: File,
  rootFolderId: number,
): Promise<Result<typeof files.$inferSelect, NodeJS.ErrnoException>> => {
  // Read the file metadata.
  const metadata = await readFileMetadata(file);

  if (!metadata.ok) {
    return metadata;
  }

  // Add the file and type metadata to the database.
  const newFile = db.transaction((tx) => {
    const newFile = tx
      .insert(files)
      .values({
        dirname: path.dirname(metadata.value.path),
        name: path.basename(metadata.value.path),
        size: metadata.value.size,
        rootFolderId: rootFolderId,
        createdAt: metadata.value.createdAt,
        updatedAt: metadata.value.updatedAt,
      })
      .returning()
      .get();

    switch (metadata.value.type) {
      case "video":
        tx.insert(videos)
          .values({
            fileId: newFile.id,
            width: metadata.value.width ?? -1,
            height: metadata.value.height ?? -1,
            duration: metadata.value.duration ?? -1,
            format: metadata.value.format ?? "",
            framerate: metadata.value.framerate ?? "",
            aspectRatio: metadata.value.aspectRatio ?? "",
          })
          .run();

        break;

      case "photo":
        tx.insert(photos)
          .values({
            fileId: newFile.id,
            width: metadata.value.width ?? -1,
            height: metadata.value.height ?? -1,
            format: metadata.value.format ?? "",
          })
          .run();

        break;

      case "music":
        tx.insert(music)
          .values({
            fileId: newFile.id,
            format: metadata.value.format ?? "",
            duration: metadata.value.duration ?? -1,
            sampleRate: metadata.value.sampleRate ?? -1,
            channels: metadata.value.channels ?? "",
          })
          .run();

        break;
    }

    return newFile;
  });

  // Generate video thumbnail if the file is a video.
  if (metadata.value.type === "video") {
    if (
      (metadata.value.width ?? Number.NEGATIVE_INFINITY) +
        (metadata.value.height ?? Number.NEGATIVE_INFINITY) >
      0
    ) {
      const res = await generateVideoThumbnails(
        newFile.id + ".png",
        metadata.value.path,
        { width: metadata.value.width!, height: metadata.value.height! },
      );

      if (!res.ok) {
        console.error(
          "Failed to generate video thumbnails:",
          res.error,
          metadata.value,
        );
      }
    }
  }

  return result.ok(newFile);
};

export const addRootFolder = async (
  db: Db,
  folderPath: string,
): Promise<Result<typeof rootFolders.$inferSelect, Error>> => {
  try {
    // Check if we can access the path.
    await fs.access(folderPath, fs.constants.R_OK | fs.constants.W_OK);

    // Check if the path is a folder.
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) {
      return result.error(new Error(`Path is not a folder: ${folderPath}`));
    }
  } catch (error) {
    switch ((error as NodeJS.ErrnoException).code) {
      case "ENOENT":
        return result.error(new Error(`Folder does not exist: ${folderPath}`));

      case "EACCES":
        return result.error(
          new Error(`Missing permissions to access folder: ${folderPath}`),
        );

      default:
        return result.error(
          new Error(`Could not access folder: ${folderPath}`),
        );
    }
  }

  // At this point we know that the folder exists and we have access to it. Check if the folder is
  // already a root folder, a subfolder of a root folder, or a parent folder of a root folder.
  const rootFolder = await db.query.rootFolders.findFirst({
    // The '/' for the left operand is necessary to match exactly equal folder names, because we
    // add it for the wildcard comparison.
    where: sql`${rootFolders.path} || '/' LIKE ${folderPath} || '/%' OR ${folderPath} || '/' LIKE ${rootFolders.path} || '/%'`,
  });

  if (rootFolder) {
    return result.error(
      new Error(
        `Folder shares path with a root folder (${rootFolder.path}): ${folderPath}`,
      ),
    );
  }

  // Get the filesystem device information the folder is on.
  const [folderInfos] = await getFilesystemInfos([folderPath]);

  // Add the folder as a new root folder.
  const newFolder = db
    .insert(rootFolders)
    .values({
      path: folderPath,
      deviceUUID: folderInfos?.uuid,
      fsType: folderInfos?.fsType,
      label: folderInfos?.label,
      physical: folderInfos?.physical,
      protocol: folderInfos?.protocol,
    })
    .returning()
    .get();

  // Scan the folder for all files recursively.
  const fileStream = scanFolder(folderPath);

  // Add all files to the database with limited concurrency.
  const limit = pLimit(4);
  const addFilePs: ReturnType<typeof addFile>[] = [];

  for await (const file of fileStream) {
    const addFileP = limit(() =>
      addFile(db, file, newFolder.id).then((result) => {
        if (!result.ok) {
          // TODO: Notify the user about the error?
        }

        return result;
      }),
    );

    addFilePs.push(addFileP);
  }

  await Promise.all(addFilePs);

  return result.ok(newFolder);
};
