import api from './api';

interface PresignResponse {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

async function getPresignedUrl(fileName: string, contentType: string): Promise<PresignResponse> {
  const { data } = await api.post<PresignResponse>('/api/upload/presign', { fileName, contentType });
  return data;
}

async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) throw new Error(`S3 업로드 실패: ${res.status}`);
}

export async function uploadMedia(file: File): Promise<string> {
  const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
  await uploadToS3(presignedUrl, file);
  return publicUrl;
}
