import { cn } from "@utils/classNameUtils";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

import { MediumBlock, SmallBlock } from "./Block";
import { Button } from "./Button/Button";
import { H4 } from "./Header";

interface FileUploadProps {
  accept?: string
  description: string
  disabled?: boolean
  maxFiles?: number
  maxSize?: number
  onFilesChange: (files: File[]) => void
  placeholder: string
  value: File[]
}

const FileUpload = ({
  accept = ".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp",
  description,
  disabled = false,
  maxFiles = 4,
  maxSize = 2 * 1024 * 1024,
  onFilesChange,
  placeholder,
  value,
}: FileUploadProps) => {
  const [
    isDragActive,
    setIsDragActive,
  ] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const isMaxFilesReached = value.length >= maxFiles;
  const isUploadDisabled = disabled || isMaxFilesReached;

  const isValidFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        return false;
      }

      if (accept) {
        const acceptedTypes = accept.split(",")
          .map(type => type.trim());
        const fileExtension = `.${file.name.split(".")
          .pop()
          ?.toLowerCase()}`;
        const mimeType = file.type;

        const isAccepted = acceptedTypes.some((acceptedType) => {
          return acceptedType.startsWith(".") ?
            fileExtension === acceptedType.toLowerCase() :
            mimeType === acceptedType ||
            mimeType.startsWith(acceptedType.replace(
              "*",
              "",
            ));
        });

        if (!isAccepted) {
          return false;
        }
      }

      return true;
    },
    [
      maxSize,
      accept,
    ],
  );

  const handleFiles = useCallback(
    (files: File[] | null) => {
      if (!files || isMaxFilesReached) {
        return;
      }

      const fileArray = [...files];
      const validFiles = fileArray.filter(file => isValidFile(file));
      const newFiles = [
        ...value,
        ...validFiles,
      ].slice(
        0,
        maxFiles,
      );

      onFilesChange(newFiles);
    },
    [
      value,
      onFilesChange,
      maxFiles,
      isMaxFilesReached,
      isValidFile,
    ],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);

      onFilesChange(newFiles);
    },
    [
      value,
      onFilesChange,
    ],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isUploadDisabled) {
        setIsDragActive(true);
      }
    },
    [isUploadDisabled],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragActive(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragActive(false);

      if (isUploadDisabled) {
        return;
      }

      const files = e.dataTransfer.files;
      const validFiles = [...files].filter(file => isValidFile(file));

      handleFiles(validFiles);
    },
    [
      isUploadDisabled,
      handleFiles,
      isValidFile,
    ],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ?? [];
      const validFiles = [...files].filter(file => isValidFile(file));

      handleFiles(validFiles);
    },
    [
      handleFiles,
      isValidFile,
    ],
  );

  const handleClick = useCallback(
    () => {
      if (!isUploadDisabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    [isUploadDisabled],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        handleClick();
      }
    },
    [handleClick],
  );

  const formatFileSize = useCallback(
    (bytes: number): string => {
      if (bytes === 0) {
        return "0 B";
      }

      const k = 1024;
      const sizes = [
        "B",
        "KB",
        "MB",
        "GB",
      ];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${Number.parseFloat((bytes / Math.pow(
        k,
        i,
      )).toFixed(2))} ${sizes[i]}`;
    },
    [],
  );

  const getFileIcon = useCallback(
    (file: File): string => {
      if (file.type.startsWith("image/")) {
        return "🖼️";
      }

      if (file.type === "application/pdf") {
        return "📄";
      }

      if (file.type.includes("word") || file.type.includes("document")) {
        return "📝";
      }

      if (file.type.startsWith("text/")) {
        return "📄";
      }

      return "📎";
    },
    [],
  );

  return (
    <SmallBlock>
      <div
        aria-label={placeholder}
        className={
          cn(
            `
              relative flex min-h-36 w-full cursor-pointer
              items-center justify-center rounded-md border border-dashed
              border-neutral-400 p-4 text-neutral-500 transition-all duration-200
              ease-in-out
              md:p-6
            `,
            isDragActive && "border-neutral-500",
            isUploadDisabled &&
            "cursor-not-allowed border-neutral-300 text-neutral-400",
          )
        }
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={isUploadDisabled ? -1 : 0}
      >
        <input
          accept={accept}
          className="hidden"
          disabled={isUploadDisabled}
          multiple
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <MediumBlock className="items-center justify-center">
          <SmallBlock className="items-center text-center">
            <p className="text-sm">{isDragActive ? t("common:fileUpload.dropFiles") : placeholder}</p>
            <p className="text-xs">{description}</p>
          </SmallBlock>
          {
            !isDragActive && (
              <Button className="px-4 py-2 text-xs" disabled={isUploadDisabled} type="button" variant="cta-secondary">
                {t("common:fileUpload.selectFiles")}
              </Button>
            )
          }
        </MediumBlock>
      </div>

      {
        value.length > 0 && (
          <SmallBlock>
            <H4 className="text-sm font-normal">
              {`${t("common:fileUpload.selectedFiles")} (${value.length}/${maxFiles})`}
            </H4>
            {
              value.map((file, index) => (
                <div
                  className={
                    `
                      flex w-full items-center justify-between gap-4
                      rounded-md border border-neutral-400 p-4 transition-all
                      duration-200 ease-in-out
                      hover:border-neutral-500
                      md:p-6
                    `
                  }
                  key={file.name}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span>{getFileIcon(file)}</span>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-neutral-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    className="text-xs"
                    disabled={disabled}
                    onClick={
                      () => {
                        removeFile(index);
                      }
                    }
                    type="button"
                    variant="cta-link"
                  >
                    {t("common:fileUpload.removeFile")}
                  </Button>
                </div>
              ))
            }
          </SmallBlock>
        )
      }
    </SmallBlock>
  );
};

export { FileUpload };
