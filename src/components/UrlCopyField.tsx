interface UrlCopyFieldProps {
  label: string;
  url: string;
  onCopy: (url: string) => void;
}

const UrlCopyField: React.FC<UrlCopyFieldProps> = ({ label, url, onCopy }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-left">
        {label}:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
        />
        <button
          onClick={() => onCopy(url)}
          className="bg-gray-500 text-white px-3 py-2 rounded text-xs hover:bg-gray-600"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default UrlCopyField;