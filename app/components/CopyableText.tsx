"use client";

import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface CopyableTextProps {
  text: string;
  className?: string;
}

export default function CopyableText({ text, className = "" }: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 cursor-pointer ${className}`} onClick={copyToClipboard}>
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
        {text}
      </code>
      <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        {copied ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <ClipboardIcon className="h-4 w-4" />
        )}
      </span>
    </span>
  );
} 