import { afterAll, beforeAll, expect, test, describe } from "vitest";
import { scanFolder } from "./fs";
import { join } from "node:path";
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
});
