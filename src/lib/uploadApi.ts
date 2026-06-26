import api from './api';

interface PresignResponse {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

async function uploadViaPresign(file: File): Promise<string> {
  const { data } = await api.post<PresignResponse>('/api/upload/presign', {
    fileName: file.name,
    contentType: file.type,
  });
  const res = await fetch(data.presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) throw new Error(`S3 업로드 실패: ${res.status}`);
  return data.publicUrl;
}

async function uploadViaLocal(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ publicUrl: string }>('/api/upload/file', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.publicUrl;
}

export async function uploadMedia(file: File): Promise<string> {
  if (process.env.NEXT_PUBLIC_UPLOAD_MODE === 'local') {
    return uploadViaLocal(file);
  }
  return uploadViaPresign(file);
}
