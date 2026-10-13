export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export function validatePdfFile(file: File): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      errorMessage: 'Không tìm thấy tệp tin được chọn.',
    };
  }

  // 1. Check file size
  if (file.size === 0) {
    return {
      isValid: false,
      errorMessage: 'Tệp tin rỗng (0 KB). Vui lòng chọn tệp PDF có nội dung.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessage: `Dung lượng tệp (${sizeInMb} MB) vượt quá giới hạn cho phép (50 MB). Vui lòng nén nhỏ file hoặc chọn file khác.`,
    };
  }

  // 2. Check extension & mime
  const fileName = file.name.toLowerCase();
  const isPdfExtension = fileName.endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension && !isPdfMime) {
    return {
      isValid: false,
      errorMessage: `Định dạng tệp "${file.name}" không hợp lệ. Ứng dụng chỉ hỗ trợ tệp định dạng .PDF.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates the raw binary header to ensure it's a real PDF file (%PDF-)
 */
export async function validatePdfBinaryHeader(buffer: ArrayBuffer): Promise<ValidationResult> {
  if (!buffer || buffer.byteLength < 5) {
    return {
      isValid: false,
      errorMessage: 'Tệp tin quá ngắn hoặc bị lỗi dữ liệu.',
    };
  }

  const header = new Uint8Array(buffer.slice(0, 5));
  // ASCII %PDF = 37, 80, 68, 70
  if (
    header[0] !== 0x25 ||
    header[1] !== 0x50 ||
    header[2] !== 0x44 ||
    header[3] !== 0x46
  ) {
    return {
      isValid: false,
      errorMessage: 'Cấu trúc tệp không phải PDF chuẩn hoặc dữ liệu đã bị lỗi hỏng.',
    };
  }

  return { isValid: true };
}
