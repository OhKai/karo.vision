import { beforeEach, describe, expect, it, vi } from "vitest";
import { addFile, addRootFolder, initManager } from "./index";
import { result } from "@/lib/utils";
import fs from "node:fs/promises";
import { files, rootFolders, videos } from "../db/schema";
import { SQL } from "drizzle-orm";
import type { Db } from "../db/drizzle";
import {
  type File,
  readFileMetadata,
  getFilesystemInfos,
  scanFolder,
} from "./fs";
import type { ErrorResult } from "@/lib/typescript-utils";
import { SQLiteSyncDialect } from "drizzle-orm/sqlite-core";
import { Stats } from "node:fs";
import { mock } from "node:test";

// Mock external dependencies
vi.mock("node:fs/promises");
vi.mock("./fs");

describe("File Manager", () => {
  // Since we restore all mocks before each test, we need to return stable mock instances in the
  // original implementation.
  const _values = {
    returning: vi.fn(),
  };
  const _insert = {
    values: vi.fn(() => _values),
  };
  // Mock DB instance
  const _mockDb = {
    transaction: vi.fn((fn) => fn(_mockDb)),
    insert: vi.fn(() => _insert),
    query: {
      rootFolders: {
        findFirst: vi.fn(),
      },
    },
  };
  // Cast to Db type to avoid TS errors in tests.
  const mockDb = _mockDb as unknown as Db;
  const mockMetadata = {
    path: "/test/path/file.mp4",
    size: 1024,
    type: "video" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    width: 1920,
    height: 1080,
    duration: 120,
    format: "h264",
    framerate: "30/1",
    aspectRatio: "16:9",
  };
  const mockDbFile = {
    id: 1,
    name: "file.mp4",
    dirname: "/test/path",
    indexedAt: new Date(),
    rootFolderId: 1,
    size: 1024,
    topic: null,
    title: null,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastOpenedAt: null,
  };
  const mockDbVideo = {
    fileId: 1,
    description: null,
    width: 1920,
    height: 1080,
    duration: 120,
    format: "h264",
    framerate: "30/1",
    aspectRatio: "16:9",
    resumeTime: null,
  };

  describe("initManager", () => {
    it("should initialize the manager", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      await initManager();
      expect(consoleSpy).toHaveBeenCalledWith("initManager");
    });
  });

  describe("addFile", () => {
    it("should successfully add a video file", async () => {
      const mockFile: File = {
        path: "/test/path/file.mp4",
        type: "video",
      };
      vi.mocked(readFileMetadata).mockResolvedValue(result.ok(mockMetadata));
      _mockDb
        .insert()
        .values()
        .returning.mockResolvedValueOnce([mockDbFile])
        .mockResolvedValueOnce([mockDbVideo]);

      const res = await addFile(mockDb, mockFile, 1);

      expect(res.ok).toBe(true);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledWith(files);
      expect(mockDb.insert).toHaveBeenCalledWith(videos);
    });

    it("should handle metadata read failure", async () => {
      const mockFile: File = {
        path: "/test/path/file.mp4",
        type: "video",
      };
      vi.mocked(readFileMetadata).mockResolvedValue(
        result.error(new Error("Failed to read metadata")),
      );

      const res = await addFile(mockDb, mockFile, 1);

      expect(res.ok).toBe(false);
      expect(mockDb.transaction).not.toHaveBeenCalled();
    });

    it("should successfully add a video file with partial probe data", async () => {
      const mockFile: File = {
        path: "/test/path/file.mp4",
        type: "video",
      };
      vi.mocked(readFileMetadata).mockResolvedValue(
        result.ok({
          path: "/test/path/file.mp4",
          size: 1024,
          type: "video" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      _mockDb
        .insert()
        .values()
        .returning.mockResolvedValueOnce([mockDbFile])
        .mockResolvedValueOnce([mockDbVideo]);

      const res = await addFile(mockDb, mockFile, 1);

      expect(res.ok).toBe(true);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledWith(files);
      expect(mockDb.insert).toHaveBeenCalledWith(videos);
    });
  });

  describe("addRootFolder", () => {
    const mockFolderPath = "/test/folder";
    const mockStats = {
      isDirectory: () => true,
    } as Stats;
    const mockFsInfos = {
      fsType: "APFS",
      label: "Macintosh HD",
      mount: "/",
      physical: "SSD",
      protocol: "PCI-Express",
      removable: false,
      size: 451000901632,
      uuid: "9E285028-BA44-4C1C-A4DC-68E6180027F1",
    };
    const mockDbRootFolder = {
      id: 1,
      path: "/test/folder",
      deviceUUID: "9E285028-BA44-4C1C-A4DC-68E6180027F1",
      label: "Macintosh HD",
      fsType: "APFS",
      protocol: "PCI-Express",
      physical: "SSD",
      indexedAt: new Date(),
    };

    beforeEach(() => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue(mockStats);
      vi.mocked(getFilesystemInfos).mockResolvedValue([mockFsInfos]);
      _mockDb.query.rootFolders.findFirst.mockResolvedValue(undefined);
      vi.mocked(scanFolder).mockImplementation(async function* () {
        yield { path: "/test/folder/file1.mp4", type: "video" };
        yield { path: "/test/folder/file2.mp4", type: "video" };
      });
      vi.mocked(readFileMetadata)
        .mockResolvedValueOnce(
          result.ok({ ...mockMetadata, path: "/test/folder/file1.mp4" }),
        )
        .mockResolvedValueOnce(
          result.ok({ ...mockMetadata, path: "/test/folder/file2.mp4" }),
        );
      _mockDb
        .insert()
        .values()
        .returning.mockResolvedValueOnce([mockDbRootFolder])
        .mockResolvedValueOnce([
          { ...mockDbFile, dirname: "/test/folder", name: "file1.mp4" },
        ])
        .mockResolvedValueOnce([
          { ...mockDbFile, dirname: "/test/folder", name: "file2.mp4" },
        ]);
      // Since we just called some mocks in beforeEach, we need to clear them again.
      vi.clearAllMocks();
    });

    it("should successfully add a root folder", async () => {
      const res = await addRootFolder(mockDb, mockFolderPath);

      expect(res.ok).toBe(true);
      expect(mockDb.insert).toHaveBeenCalledWith(rootFolders);
      expect(mockDb.insert).toHaveBeenCalledWith(files);
      expect(mockDb.insert).toHaveBeenCalledWith(videos);
      expect(mockDb.insert).toHaveBeenCalledTimes(5);
    });

    it("should handle non-existent folder", async () => {
      const error = new Error("ENOENT");
      (error as NodeJS.ErrnoException).code = "ENOENT";
      vi.mocked(fs.access).mockRejectedValue(error);

      const res = (await addRootFolder(
        mockDb,
        mockFolderPath,
      )) as ErrorResult<NodeJS.ErrnoException>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain("Folder does not exist");
    });

    it("should handle permission errors", async () => {
      const error = new Error("EACCES");
      (error as NodeJS.ErrnoException).code = "EACCES";
      vi.mocked(fs.access).mockRejectedValue(error);

      const res = (await addRootFolder(
        mockDb,
        mockFolderPath,
      )) as ErrorResult<Error>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain("Missing permissions");
    });

    it("should handle other errors", async () => {
      const error = new Error("EPERM");
      (error as NodeJS.ErrnoException).code = "EPERM";
      vi.mocked(fs.access).mockRejectedValue(error);

      const res = (await addRootFolder(
        mockDb,
        mockFolderPath,
      )) as ErrorResult<Error>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain("Could not access folder");
    });

    it("should handle non-directory paths", async () => {
      vi.mocked(fs.stat).mockResolvedValue({
        isDirectory: () => false,
      } as Stats);

      const res = (await addRootFolder(
        mockDb,
        mockFolderPath,
      )) as ErrorResult<Error>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain("Path is not a folder");
    });

    it("should prevent adding subfolder of existing root", async () => {
      _mockDb.query.rootFolders.findFirst.mockResolvedValue({
        ...mockDbRootFolder,
        path: "/test",
      });

      const res = (await addRootFolder(
        mockDb,
        mockFolderPath,
      )) as ErrorResult<Error>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain(
        "Folder shares path with a root folder",
      );

      expect(mockDb.query.rootFolders.findFirst).toHaveBeenCalledWith({
        where: expect.any(SQL),
      });

      const whereClause =
        _mockDb.query.rootFolders.findFirst.mock.calls[0][0].where;

      const sqliteDialect = new SQLiteSyncDialect();
      const query = sqliteDialect.sqlToQuery(whereClause as SQL);

      // We can't really test the SQL to be correct in unit tests, but we can make sure any changes
      // are intentional.
      expect(query).toMatchInlineSnapshot(`
        {
          "params": [],
          "sql": "/test/folder/% LIKE "root_folders"."path" || '/%'",
        }
      `);
    });

    it("should prevent adding parent folder of existing root", async () => {
      _mockDb.query.rootFolders.findFirst.mockResolvedValue(mockDbRootFolder);

      const res = (await addRootFolder(mockDb, "/test")) as ErrorResult<Error>;

      expect(res.ok).toBe(false);
      expect(res.error.message).toContain(
        "Folder shares path with a root folder",
      );
    });

    it("should handle file errors", async () => {
      const error = new Error("EACCES");
      (error as NodeJS.ErrnoException).code = "EACCES";
      vi.mocked(readFileMetadata)
        .mockReset()
        .mockResolvedValueOnce(result.error(error))
        .mockResolvedValueOnce(
          result.ok({ ...mockMetadata, path: "/test/folder/file2.mp4" }),
        );

      const res = await addRootFolder(mockDb, mockFolderPath);

      // Should still add the second file.
      expect(res.ok).toBe(true);
      expect(mockDb.insert).toHaveBeenCalledWith(rootFolders);
      expect(mockDb.insert).toHaveBeenCalledWith(files);
      expect(mockDb.insert).toHaveBeenCalledWith(videos);
      expect(mockDb.insert).toHaveBeenCalledTimes(3);
    });
  });
});
