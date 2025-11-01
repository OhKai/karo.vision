import sharp from "sharp";
import { readdir, mkdir, stat } from "fs/promises";
import { join, parse } from "path";
import { existsSync } from "fs";

// Configuration
const IMAGES_DIR = join(process.cwd(), "images");
const OUTPUT_DIR = join(process.cwd(), "public/optimized");

// Standard sizes based on common device widths and DPR
const STANDARD_SIZES = [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

const FORMATS = ["webp", "png"] as const; // WebP for modern browsers, PNG fallback
const QUALITY = {
  webp: 80,
  png: 85,
};

// Images to exclude from optimization
const EXCLUDE_PATTERNS = [/^optimized/, /^favicon/, /\.ico$/, /\.svg$/];

type ImageFormat = (typeof FORMATS)[number];

async function optimizeImage(
  inputPath: string,
  outputPath: string,
  width: number,
  format: ImageFormat,
): Promise<void> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Don't upscale images
  const targetWidth =
    metadata.width && width > metadata.width ? metadata.width : width;

  await image
    .resize(targetWidth, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .toFormat(format, { quality: QUALITY[format] })
    .toFile(outputPath);
}

async function processImage(
  imagePath: string,
  fileName: string,
  outputSubDir: string,
): Promise<void> {
  const stats = await stat(imagePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\nProcessing: ${fileName} (${sizeInMB}MB)`);

  // Generate all size and format combinations
  for (const size of STANDARD_SIZES) {
    for (const format of FORMATS) {
      const outputFileName = `${fileName}-${size}.${format}`;
      const outputPath = join(outputSubDir, outputFileName);

      try {
        await optimizeImage(imagePath, outputPath, size, format);
        const outputStats = await stat(outputPath);
        const outputSizeInKB = (outputStats.size / 1024).toFixed(0);
        console.log(`  ✓ ${outputFileName} (${outputSizeInKB}KB)`);
      } catch (error) {
        console.error(`  ✗ Failed to create ${outputFileName}:`, error);
      }
    }
  }
}

async function findImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    const relativeName = entry.name;

    // Skip excluded patterns
    if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativeName))) {
      continue;
    }

    // Only process image files
    if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) {
      images.push(join(dir, entry.name));
    }
  }

  return images;
}

async function main() {
  console.log("🖼️  Image Optimization Script\n");
  console.log(`Source: ${IMAGES_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Sizes: ${STANDARD_SIZES.join(", ")}px`);
  console.log(`Formats: ${FORMATS.join(", ")}\n`);

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  // Check if images directory exists
  if (!existsSync(IMAGES_DIR)) {
    console.error(`Images directory not found: ${IMAGES_DIR}`);
    return;
  }

  // Find all images in images directory
  const images = await findImages(IMAGES_DIR);

  if (images.length === 0) {
    console.log("No images found to optimize.");
    return;
  }

  console.log(`Found ${images.length} image(s) to optimize\n`);
  console.log("─".repeat(60));

  // Process each image
  for (const imagePath of images) {
    const { name: fileName } = parse(imagePath);
    await processImage(imagePath, fileName, OUTPUT_DIR);
  }

  console.log("\n" + "─".repeat(60));
  console.log("✅ Image optimization complete!\n");
}

main().catch((error) => {
  console.error("Error optimizing images:", error);
  process.exit(1);
});
