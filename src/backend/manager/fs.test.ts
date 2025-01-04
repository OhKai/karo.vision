import { afterAll, beforeAll, expect, test, describe } from "vitest";
import { readFileMetadata, scanFolder } from "./fs";
import { join, basename } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";

const setupTestDir = async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), "home-cloud-test-"));

  const files = ["video.mp4", "photo.jpg", "music.mp3", "document.txt"];

  await Promise.all(
    files.map((file) => writeFile(join(tmpDir, file), "test content")),
  );

  // Create a nested directory
  const testDir = join(tmpDir, "test");
  await mkdir(testDir);

  await writeFile(join(testDir, "video.mp4"), "test content");

  return tmpDir;
};

describe("fs", () => {
  describe("scanFolder", () => {
    let testDir: string;

    beforeAll(async () => {
      testDir = await setupTestDir();
    });

    afterAll(async () => {
      await rm(testDir, { recursive: true });
    });

    test("should classify files correctly with default extensions", async () => {
      // Use Set to ignore order since fast-glob returns files in random order.
      const expectedResults = new Set([
        { type: "video", path: join(testDir, "video.mp4") },
        { type: "photo", path: join(testDir, "photo.jpg") },
        { type: "music", path: join(testDir, "music.mp3") },
        { type: "other", path: join(testDir, "document.txt") },
        { type: "video", path: join(testDir, "test/video.mp4") },
      ]);

      const results = new Set();
      for await (const file of scanFolder(testDir)) {
        results.add(file);
      }

      expect(results).toEqual(expectedResults);
    });

    test("should classify files correctly with custom extensions", async () => {
      const customExtensions = {
        videos: ["mp3"],
        photos: ["txt"],
        music: ["mp4"],
        exclude: ["jpg"],
      };

      // Use Set to ignore order since fast-glob returns files in random order.
      const expectedResults = new Set([
        { type: "music", path: join(testDir, "video.mp4") },
        { type: "photo", path: join(testDir, "document.txt") },
        { type: "video", path: join(testDir, "music.mp3") },
        { type: "music", path: join(testDir, "test/video.mp4") },
      ]);

      const results = new Set();
      for await (const file of scanFolder(testDir, {
        extensions: customExtensions,
      })) {
        results.add(file);
      }

      expect(results).toEqual(expectedResults);
    });

    test("should classify files correctly with partial custom extensions", async () => {
      const customExtensions = {
        videos: ["mov"],
      };

      // Use Set to ignore order since fast-glob returns files in random order.
      const expectedResults = new Set([
        { type: "other", path: join(testDir, "video.mp4") },
        { type: "photo", path: join(testDir, "photo.jpg") },
        { type: "music", path: join(testDir, "music.mp3") },
        { type: "other", path: join(testDir, "document.txt") },
        { type: "other", path: join(testDir, "test/video.mp4") },
      ]);

      const results = new Set();
      for await (const file of scanFolder(testDir, {
        extensions: customExtensions,
      })) {
        results.add(file);
      }

      expect(results).toEqual(expectedResults);
    });

    test("should return no files for a non-existent folder", async () => {
      const results = new Set();
      for await (const file of scanFolder("/non-existent-folder")) {
        results.add(file);
      }

      expect(results).toEqual(new Set([]));
    });
  });

  describe("readFileMetadata", () => {
    const sampleFilesDir = join(__dirname, "__fixtures__/sample-files");
    const testFiles = [
      {
        type: "video",
        path: join(sampleFilesDir, "file_example_AVI_480_750kB.avi"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_WEBP_50kB.webp"),
      },
      { type: "other", path: join(sampleFilesDir, "zip_2MB.zip") },
      { type: "other", path: join(sampleFilesDir, "file-sample_100kB.doc") },
      { type: "other", path: join(sampleFilesDir, "file-sample_100kB.docx") },
      { type: "other", path: join(sampleFilesDir, "file-sample_100kB.odt") },
      { type: "other", path: join(sampleFilesDir, "file-sample_100kB.rtf") },
      { type: "other", path: join(sampleFilesDir, "file-sample_150kB.pdf") },
      {
        type: "video",
        path: join(sampleFilesDir, "file_example_MOV_480_700kB.mov"),
      },
      { type: "music", path: join(sampleFilesDir, "file_example_OOG_1MG.ogg") },
      {
        type: "video",
        path: join(sampleFilesDir, "file_example_WEBM_480_900KB.webm"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_GIF_500kB.gif"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_JPG_100kB.jpg"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_PNG_500kB.png"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_SVG_20kB.svg"),
      },
      {
        type: "photo",
        path: join(sampleFilesDir, "file_example_TIFF_1MB.tiff"),
      },
      { type: "photo", path: join(sampleFilesDir, "file_example_favicon.ico") },
      {
        type: "music",
        path: join(sampleFilesDir, "file_example_MP3_700KB.mp3"),
      },
      { type: "music", path: join(sampleFilesDir, "file_example_WAV_1MG.wav") },
      {
        type: "music",
        path: join(sampleFilesDir, "file_example_OGG_480_1_7mg.ogg"),
      },
      {
        type: "video",
        path: join(sampleFilesDir, "file_example_MP4_480_1_5MG.mp4"),
      },
      {
        type: "video",
        path: join(sampleFilesDir, "file_example_WMV_480_1_2MB.wmv"),
      },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_CSV_5000.csv"),
      },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_PPT_250kB.ppt"),
      },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_ODP_200kB.odp"),
      },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_XLSX_10.xlsx"),
      },
      { type: "other", path: join(sampleFilesDir, "file_example_ODS_10.ods") },
      { type: "other", path: join(sampleFilesDir, "file_example_XLS_10.xls") },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_JSON_1kb.json"),
      },
      {
        type: "other",
        path: join(sampleFilesDir, "file_example_XML_24kb.xml"),
      },
      { type: "other", path: join(sampleFilesDir, "Title.html") },
    ] as const;
    const corruptedTestFiles = [
      {
        type: "video",
        path: join(__dirname, "__fixtures__/corrupted-files/empty.mp4"),
      },
      {
        type: "photo",
        path: join(__dirname, "__fixtures__/corrupted-files/empty.png"),
      },
      {
        type: "video",
        path: join(__dirname, "__fixtures__/corrupted-files/cut-off-half.mp4"),
      },
      {
        type: "video",
        path: join(
          __dirname,
          "__fixtures__/corrupted-files/cut-off-header.mp4",
        ),
      },
      {
        type: "video",
        path: join(
          __dirname,
          "__fixtures__/corrupted-files/zero-after-50000.mp4",
        ),
      },
    ] as const;

    testFiles.forEach((file) => {
      test(`should read metadata for a ${file.type} file (${basename(file.path)})`, async () => {
        const metadata = await readFileMetadata(file);

        expect(metadata).toMatchSnapshot();
      });
    });

    corruptedTestFiles.forEach((file) => {
      test(`should handle ffprobe errors gracefully (${basename(file.path)})`, async () => {
        const metadataP = readFileMetadata(file);

        await expect(metadataP).resolves.not.toThrow();
        await expect(metadataP).resolves.toMatchSnapshot();
      });
    });

    test("should return an error object for a non-existent file", async () => {
      const file = { type: "video" as const, path: "/non-existent-file.mp4" };

      const metadataP = readFileMetadata(file);

      await expect(metadataP).resolves.not.toThrow();
      const metadata = await metadataP;
      expect(metadata).toEqual({
        ok: false,
        error: expect.objectContaining({
          code: "ENOENT",
        }),
      });
    });
  });
});
