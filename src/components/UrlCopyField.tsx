import { useState } from "react";

interface UrlCopyFieldProps {
  label: string;
  url: string;
  onCopy: (url: string) => void;
}

const UrlCopyField: React.FC<UrlCopyFieldProps> = ({ label, url, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-left text-gray-300">
        {label}:
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-700 rounded text-sm bg-gray-900 text-gray-100 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default UrlCopyField;
