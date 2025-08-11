interface UrlCopyFieldProps {
  label: string;
  url: string;
  onCopy: (url: string) => void;
}

const UrlCopyField: React.FC<UrlCopyFieldProps> = ({ label, url, onCopy }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-left text-gray-300">
        {label}:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-700 rounded text-sm bg-gray-900 text-gray-100 focus:outline-none"
        />
        <button
          onClick={() => onCopy(url)}
          className="bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default UrlCopyField;
