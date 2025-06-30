"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
}

export default function UploadArea({ onFileSelected }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent/40 text-muted-foreground"
    >
      <UploadCloud className="h-8 w-8 mb-2" />
      <p className="text-sm text-center">
        Drag & drop or click to upload<br />
        <span className="font-medium">(.csv, .xlsx)</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
