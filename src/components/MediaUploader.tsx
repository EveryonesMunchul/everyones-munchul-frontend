'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { uploadMedia } from '@/lib/uploadApi';
import { extractErrorMessage } from '@/lib/errorUtils';

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm';
const MAX_FILES = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;   // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100MB

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  isVideo: boolean;
  status: 'pending' | 'uploading' | 'done' | 'error';
  publicUrl?: string;
  error?: string;
}

interface Props {
  onChange: (urls: string[]) => void;
}

export default function MediaUploader({ onChange }: Props) {
  const [items, setItems] = useState<MediaFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // onChange를 ref로 관리 — items 변경 effect가 onChange 참조에 의존하지 않도록
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  // items가 변경될 때마다 완료된 URL 목록을 부모에 전달
  useEffect(() => {
    onChangeRef.current(
      items.filter((f) => f.status === 'done' && f.publicUrl).map((f) => f.publicUrl!)
    );
  }, [items]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_FILES - items.length;
    const toAdd = Array.from(files).slice(0, remaining);

    const newItems: MediaFile[] = toAdd.map((file) => {
      const isVideo = file.type.startsWith('video/');
      const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      const limitLabel = isVideo ? '100MB' : '10MB';

      return {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isVideo,
        status: file.size > limit ? 'error' : 'pending',
        error: file.size > limit ? `파일 크기는 ${limitLabel} 이하여야 합니다` : undefined,
      };
    });

    const next = [...items, ...newItems];
    setItems(next);

    newItems.filter((m) => m.status === 'pending').forEach((m) => startUpload(m, next));
  };

  const startUpload = (item: MediaFile, current: MediaFile[]) => {
    setItems(current.map((m) =>
      m.id === item.id ? { ...m, status: 'uploading' as const } : m
    ));

    uploadMedia(item.file)
      .then((publicUrl) => {
        setItems((prev) =>
          prev.map((m) => m.id === item.id ? { ...m, status: 'done' as const, publicUrl } : m)
        );
      })
      .catch((err) => {
        setItems((prev) =>
          prev.map((m) =>
            m.id === item.id ? { ...m, status: 'error' as const, error: extractErrorMessage(err) } : m
          )
        );
      });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const isUploading = items.some((m) => m.status === 'uploading');

  return (
    <div className="space-y-3">
      {/* 드롭존 */}
      {items.length < MAX_FILES && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-1.5 py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition text-center"
        >
          <span className="text-2xl">📎</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            클릭하거나 파일을 드래그하세요
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            이미지(JPG·PNG·GIF·WEBP) 또는 동영상(MP4·MOV·WEBM) · 최대 {MAX_FILES}개
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* 미리보기 그리드 */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {item.isVideo ? (
                <video src={item.preview} className="w-full h-full object-cover" muted />
              ) : (
                <Image src={item.preview} alt="" fill className="object-cover" unoptimized />
              )}

              {/* 상태 오버레이 */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center p-2">
                  <span className="text-white text-xs text-center leading-tight">{item.error}</span>
                </div>
              )}
              {item.status === 'done' && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition"
              >
                <span className="text-white text-xs leading-none">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">업로드 중... 잠시 기다려주세요</p>
      )}
    </div>
  );
}
