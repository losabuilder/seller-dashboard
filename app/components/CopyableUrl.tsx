"use client";

import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface CopyableUrlProps {
  url: string;
  label?: string;
}

export default function CopyableUrl({ url, label }: CopyableUrlProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <div className="flex items-center w-full">
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-l-md p-2 overflow-x-auto whitespace-nowrap">
          <code className="text-blue-600 dark:text-blue-400">{url}</code>
        </div>
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-md p-3 transition-colors duration-200 flex items-center justify-center min-w-[48px]"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <ClipboardIcon className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
} 