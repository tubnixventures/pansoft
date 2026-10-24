/**
 * Pansoft Technologies – Cloudflare R2 Object Storage Client
 * Handles presigned URL generation, multi-file zipping using JSZip,
 * upload streaming simulation, and archive inspection.
 */
import JSZip from 'jszip';
import { nanoid } from 'nanoid';
import { R2StoredFile } from '../types';

const R2_BUCKET_NAME = 'pansoft-tech-production-r2';
const R2_ENDPOINT = 'https://r2.pansoft.tech';

class CloudflareR2Service {
  private files: Map<string, R2StoredFile> = new Map();

  constructor() {
    this.seedDefaultFiles();
  }

  private seedDefaultFiles() {
    this.files.set('submissions/freelance/2026-10/housika-jwt-review-patch-v2.zip', {
      key: 'submissions/freelance/2026-10/housika-jwt-review-patch-v2.zip',
      fileName: 'housika-jwt-review-patch-v2.zip',
      fileSize: 142850,
      mimeType: 'application/zip',
      presignedUrl: `${R2_ENDPOINT}/submissions/freelance/2026-10/housika-jwt-review-patch-v2.zip?sig=edge_auth_88291a`,
      uploadedAt: '2026-10-22T13:45:00Z',
      fileTree: ['src/middleware/jwt.ts', 'src/tests/auth.test.ts', 'package.json', 'README.md', 'vitest.config.ts', 'tsconfig.json'],
    });

    this.files.set('submissions/freelance/2026-10/r2-presign-streamer.zip', {
      key: 'submissions/freelance/2026-10/r2-presign-streamer.zip',
      fileName: 'r2-presign-streamer.zip',
      fileSize: 320140,
      mimeType: 'application/zip',
      presignedUrl: `${R2_ENDPOINT}/submissions/freelance/2026-10/r2-presign-streamer.zip?sig=edge_auth_44120f`,
      uploadedAt: '2026-10-23T18:20:00Z',
      fileTree: ['worker/r2.ts', 'worker/presign.ts', 'tests/r2.test.ts', 'wrangler.toml', 'package.json'],
    });
  }

  /**
   * Generates a signed R2 PUT upload URL with 15-minute validity window
   */
  public generatePresignedUploadUrl(fileName: string, folder = 'attachments'): {
    key: string;
    uploadUrl: string;
    expiresAt: string;
    publicUrl: string;
  } {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${folder}/${new Date().toISOString().slice(0, 7)}/${nanoid(6)}_${safeName}`;
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const uploadUrl = `${R2_ENDPOINT}/${key}?X-Amz-Signature=${token}&expires=900`;
    const publicUrl = `${R2_ENDPOINT}/${key}`;

    return {
      key,
      uploadUrl,
      expiresAt,
      publicUrl,
    };
  }

  /**
   * Bundles a list of files or code snippets into a compressed .zip archive
   */
  public async createZipArchive(
    files: Array<{ name: string; content: string | Blob | ArrayBuffer }>,
    archiveName = 'pansoft-bundle.zip'
  ): Promise<{ blob: Blob; fileName: string; fileCount: number; fileList: string[]; size: number }> {
    const zip = new JSZip();
    const fileList: string[] = [];

    files.forEach(file => {
      zip.file(file.name, file.content);
      fileList.push(file.name);
    });

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    return {
      blob,
      fileName: archiveName.endsWith('.zip') ? archiveName : `${archiveName}.zip`,
      fileCount: files.length,
      fileList,
      size: blob.size,
    };
  }

  /**
   * Inspects and unzips an uploaded archive to reveal its directory tree and contents
   */
  public async inspectZipArchive(file: Blob | File): Promise<{
    fileCount: number;
    fileTree: string[];
    entries: Array<{ path: string; size: number; isDirectory: boolean }>;
  }> {
    const zip = await JSZip.loadAsync(file);
    const fileTree: string[] = [];
    const entries: Array<{ path: string; size: number; isDirectory: boolean }> = [];

    zip.forEach((relativePath, zipEntry) => {
      fileTree.push(relativePath);
      entries.push({
        path: relativePath,
        isDirectory: zipEntry.dir,
        size: (zipEntry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize || 0,
      });
    });

    return {
      fileCount: fileTree.length,
      fileTree,
      entries,
    };
  }

  /**
   * Uploads an object into the Cloudflare R2 bucket
   */
  public async uploadToR2(
    key: string,
    fileBlob: Blob | File,
    fileName: string,
    presignedUrl: string,
    fileTree?: string[]
  ): Promise<R2StoredFile> {
    // In browser context, we record the file metadata and blob in the R2 catalog
    const stored: R2StoredFile = {
      key,
      fileName,
      fileSize: fileBlob.size,
      mimeType: fileBlob.type || 'application/octet-stream',
      presignedUrl,
      uploadedAt: new Date().toISOString(),
      fileTree: fileTree || [fileName],
      dataBlob: fileBlob,
    };

    this.files.set(key, stored);
    return stored;
  }

  public getStoredFile(key: string): R2StoredFile | undefined {
    return this.files.get(key);
  }

  public getAllFiles(): R2StoredFile[] {
    return Array.from(this.files.values());
  }

  public getBucketInfo() {
    return {
      bucketName: R2_BUCKET_NAME,
      region: 'WNAM (Automatic Multi-Region Edge)',
      egressFee: '$0.00 / GB (Cloudflare R2 Zero Egress)',
      storageClass: 'Standard Distributed Object Store',
      activeObjects: this.files.size,
    };
  }
}

export const r2 = new CloudflareR2Service();
