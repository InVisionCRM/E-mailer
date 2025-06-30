import type { z } from 'zod';

// Simple email regex for basic validation fallback
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

/**
 * Extract email strings from a value, performing a basic validation.
 */
function toEmailList(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === 'string') {
    return emailRegex.test(value.trim()) ? [value.trim()] : [];
  }
  return [];
}

/**
 * Parse a CSV file and return an array of emails.
 * Assumes the file has either a column named "email" (case-insensitive)
 * or a single column of raw email addresses.
 */
export async function parseCsv(file: File): Promise<string[]> {
  const Papa = (await import('papaparse')).default;
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete: (results: any) => {
        const emails: string[] = [];
        const data = results.data as Record<string, unknown>[];
        data.forEach((row) => {
          const keys = Object.keys(row);
          if (keys.length === 1) {
            emails.push(...toEmailList(row[keys[0]]));
          } else {
            const emailKey = keys.find((k) => k.toLowerCase().includes('email'));
            if (emailKey) {
              emails.push(...toEmailList(row[emailKey]));
            }
          }
        });
        resolve(emails);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => reject(err),
    });
  });
}

/**
 * Parse an Excel file (.xlsx or .xls) and return an array of emails.
 * Uses SheetJS under the hood.
 */
export async function parseXlsx(file: File): Promise<string[]> {
  const XLSX = await import('xlsx');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);
        const emails: string[] = [];
        json.forEach((row) => {
          const keys = Object.keys(row);
          if (keys.length === 1) {
            emails.push(...toEmailList(row[keys[0]]));
          } else {
            const emailKey = keys.find((k) => k.toLowerCase().includes('email'));
            if (emailKey) {
              emails.push(...toEmailList(row[emailKey]));
            }
          }
        });
        resolve(emails);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse a recipient file (CSV or XLSX). Returns list of email strings.
 */
export async function parseRecipientFile(file: File): Promise<string[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCsv(file);
  if (ext === 'xlsx' || ext === 'xls') return parseXlsx(file);
  throw new Error('Unsupported file type');
}
