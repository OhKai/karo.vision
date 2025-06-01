import { globStream } from "fast-glob";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs/promises";
import { Stats } from "node:fs";
import type { Result } from "@/lib/typescript-utils";
import { blockDevices, Systeminformation } from "systeminformation";
import { result } from "@/lib/utils";

// Some research about fast fs walk packages (01.01.2025):
//
// - fs.readdir() is slow and doesn't support streaming.
// - fs.promises.opendir() supports streaming (async iterator) but is slower than userland packages.
// - fdir is the fastest package for walking directories, but doesn't support streaming.
// - readdirp is slower than fdir but supports streaming, but no globs.
// - fast-glob is slower than fdir but supports streaming and globs.

// prettier-ignore
export const DEFAULT_VIDEO_EXTENSIONS = [
  "3g2", "3gp", "aaf", "asf","avchd","avi", "drc", "flv", "m2v", "m3u8", "m4p", "m4v", "mkv",
  "mov", "mp2", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogv", "qt", "rm", "rmvb", "roq",
  "svi", "vob", "webm", "wmv", "yuv",
];

// prettier-ignore
export const DEFAULT_PHOTO_EXTENSIONS = [
  "ase", "art", "bmp", "blp", "cd5", "cit", "cpt", "cr2", "cut", "dds", "dib", "djvu", "egt",
  "exif", "gif", "gpl", "grf", "icns", "ico", "iff", "jng", "jpeg", "jpg", "jfif", "jp2", "jps",
  "lbm", "max", "miff", "mng", "msp", "nef", "nitf", "ota", "pbm", "pc1", "pc2", "pc3", "pcf",
  "pcx", "pdn", "pgm", "PI1", "PI2", "PI3", "pict", "pct", "pnm", "pns", "ppm", "psb", "psd",
  "pdd", "psp", "px", "pxm", "pxr", "qfx", "raw", "rle", "sct", "sgi", "rgb", "int", "bw", "tga",
  "tiff", "tif", "vtf", "xbm", "xcf", "xpm", "3dv", "amf", "ai", "awg", "cgm", "cdr", "cmx", "dxf",
  "e2d", "egt", "eps", "fs", "gbr", "odg", "svg", "stl", "vrml", "x3d", "sxd", "v2d", "vnd", "wmf",
  "emf", "art", "xar", "png", "webp", "jxr", "hdp", "wdp", "cur", "ecw", "iff", "lbm", "liff",
  "nrrd", "pam", "pcx", "pgf", "sgi", "rgb", "rgba", "bw", "int", "inta", "sid", "ras", "sun",
  "tga", "heic", "heif",
];

// prettier-ignore
export const DEFAULT_MUSIC_EXTENSIONS = [
  "aa", "aac", "aax", "act", "aiff", "alac", "amr", "ape", "au", "awb", "dct", "dss", "dvf",
  "flac", "gsm", "ivs", "m4a", "m4b", "m4p", "mmf", "mp3", "mpc", "msv", "ogg", "oga", "mogg",
  "opus", "ra", "rm", "rf64", "sln", "tta", "wav", "wma", "wv",
];

export const DEFAULT_EXCLUDE_EXTENSIONS = [];

export type File = {
  type: "video" | "photo" | "music" | "other";
  path: string;
};

/**
 * Recursively scans a folder and classifies files based on their file type extension.
 *
 * @param folderPath The path to the folder to scan.
 * @param options Options to customize the classification of file types.
 * @returns An async generator that yields the type of file and its path.
 */
export async function* scanFolder(
  folderPath: string,
  options?: {
    /** Override the default file type extension classifiers. If a category is not set, the default
     * extensions will be used.  */
    extensions?: {
      /** Which file type extensions to classify in the _videos_ category. */
      videos?: string[];
      /** Which file type extensions to classify in the _photos_ category. */
      photos?: string[];
      /** Which file type extensions to classify in the _music_ category. */
      music?: string[];
      /** Which file type extensions to exclude from being classified. */
      exclude?: string[];
    };
  },
): AsyncGenerator<File> {
  const exclude = options?.extensions?.exclude ?? DEFAULT_EXCLUDE_EXTENSIONS;

  const stream = globStream(`${folderPath}/**/*`, {
    onlyFiles: true,
    // Ignore all excluded files as specified.
    ignore:
      exclude.length > 0
        ? exclude.length === 1
          ? [`**/*.${exclude[0]}`]
          : [`**/*.{${exclude.join(",")}}`]
        : undefined,
  });

  // Qualify the type of file.
  for await (const entry of stream) {
    const ext = path.extname(entry as string).substring(1);
    if (
      (options?.extensions?.videos ?? DEFAULT_VIDEO_EXTENSIONS).includes(ext)
    ) {
      yield { type: "video", path: entry as string };
      continue;
    } else if (
      (options?.extensions?.photos ?? DEFAULT_PHOTO_EXTENSIONS).includes(ext)
    ) {
      yield { type: "photo", path: entry as string };
      continue;
    } else if (
      (options?.extensions?.music ?? DEFAULT_MUSIC_EXTENSIONS).includes(ext)
    ) {
      yield { type: "music", path: entry as string };
      continue;
    }
    yield { type: "other", path: entry as string };
  }
}

type VideoMetadata = {
  type: "video";
  path: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  framerate?: string;
  aspectRatio?: string;
};

type PhotoMetadata = {
  type: "photo";
  path: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  width?: number;
  height?: number;
  format?: string;
};

type MusicMetadata = {
  type: "music";
  path: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
};

type OtherMetadata = {
  type: "other";
  path: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Reads metadata from a file. The metadata is file type specific.
 *
 * IMPORTANT: Since this function spawns a child process to run ffprobe, it should not be called too
 * many times in parallel.
 *
 * @param file The file to read metadata from.
 * @returns The metadata of the file.
 */
export async function readFileMetadata(file: {
  type: "video";
  path: string;
}): Promise<Result<VideoMetadata, NodeJS.ErrnoException>>;
export async function readFileMetadata(file: {
  type: "photo";
  path: string;
}): Promise<Result<PhotoMetadata, NodeJS.ErrnoException>>;
export async function readFileMetadata(file: {
  type: "music";
  path: string;
}): Promise<Result<MusicMetadata, NodeJS.ErrnoException>>;
export async function readFileMetadata(file: {
  type: "other";
  path: string;
}): Promise<Result<OtherMetadata, NodeJS.ErrnoException>>;
// Note: Typescript ignores the implementation signature and only looks at the overloads. To still
// allow a generic call signature, we need to add the implementation signature as an overload.
export async function readFileMetadata(
  file: File,
): Promise<
  Result<
    VideoMetadata | PhotoMetadata | MusicMetadata | OtherMetadata,
    NodeJS.ErrnoException
  >
>;
export async function readFileMetadata(file: File) {
  let stats: Stats;
  try {
    stats = await fs.stat(file.path);
  } catch (err) {
    return result.error(err as NodeJS.ErrnoException);
  }
  const statsObj = {
    type: file.type,
    path: file.path,
    size: stats.size,
    createdAt: stats.birthtime,
    updatedAt: stats.mtime,
  };

  if (file.type === "video" || file.type === "photo") {
    // TODO: set the ffmpeg path for production binaries
    const ffmpegCommand = ffmpeg(file.path);
    const probeData = await new Promise<ffmpeg.FfprobeData>(
      (resolve, reject) =>
        ffmpegCommand.ffprobe((err, metadata) => {
          if (err) {
            return reject(err);
          }
          resolve(metadata);
        }),
      // If ffprobe fails, but stat() succeeds, we still return the metadata, but without probe
      // data.
    ).catch(() => undefined);

    // Find the video stream for video or photo meta infos.
    const videoStream = probeData?.streams.find(
      (stream) => stream.codec_type === "video",
    );

    return result.ok({
      ...statsObj,
      ...(videoStream &&
        (file.type === "video"
          ? {
              width: videoStream.width,
              height: videoStream.height,
              // Wrongly typed as string in fluent-ffmpeg. Except when it is "N/A".
              duration:
                typeof videoStream.duration === "string"
                  ? -1
                  : (videoStream.duration as unknown as number),
              format: videoStream.codec_name,
              framerate: videoStream.r_frame_rate,
              aspectRatio: videoStream.display_aspect_ratio,
            }
          : {
              width: videoStream.width,
              height: videoStream.height,
              format: videoStream.codec_name,
            })),
    });
  }

  return result.ok(statsObj);
}

/**
 * Maps paths to their respective device information.
 * @param paths The paths to map to device information.
 * @returns The device information for each path, if any.
 */
export const getFilesystemInfos = async (paths: string[]) => {
  // https://github.com/sebhildebrandt/systeminformation/blob/0c25994c8598d872bdbe8980b1a98cc9584600e6/lib/filesystem.js#L1010
  const devices = await blockDevices();

  const infos = paths.map((path) => {
    // Find the device that the path is on by checking for the most specific mount path.
    let device: Systeminformation.BlockDevicesData | undefined;
    for (const _device of devices) {
      if (
        path.startsWith(_device.mount) &&
        // Note: This also skips empty mount paths.
        _device.mount.length > (device?.mount.length ?? 0)
      ) {
        device = _device;
      }
    }

    // We only return some useful properties from the device object.
    return (
      device && {
        fsType: device.fsType,
        mount: device.mount,
        size: device.size,
        physical: device.physical,
        uuid: device.uuid,
        label: device.label,
        removable: device.removable,
        protocol: device.protocol,
      }
    );
  });

  return infos;
};

export const generateVideoThumbnails = async (
  thumbPattern: string,
  filePath: string,
  fileResolution: { width: number; height: number },
  // The thumb size is the max size of a tile x2 for retina displays.
  size: "thumb" | "seeker" = "thumb",
  timestamps: string[] = ["12%"],
) => {
  const ffmpegCommand = ffmpeg(filePath);
  // Ensure thumbnails directory exists.
  const thumbDir = path.join(path.dirname(filePath), ".hc_thumbs");

  try {
    // Note: The recursive option prevents an error if the directory already exists.
    await fs.mkdir(thumbDir, { recursive: true });
  } catch (err) {
    return result.error(err as NodeJS.ErrnoException);
  }

  // Calculate the thumbnail size based on the file resolution.
  const ratio = fileResolution.width / fileResolution.height;
  const biggerWidth = 16 / 9 <= ratio;
  const thumbSize =
    size === "thumb"
      ? biggerWidth
        ? `900x${Math.round(900 * (1 / ratio))}`
        : `${Math.round(506 * ratio)}x506`
      : "200x200";

  try {
    await new Promise((resolve, reject) =>
      ffmpegCommand.on("end", resolve).on("error", reject).screenshots({
        timestamps: timestamps,
        filename: thumbPattern,
        folder: thumbDir,
        size: thumbSize,
      }),
    );
  } catch (err) {
    return result.error(err as Error);
  }

  return result.ok();
};
