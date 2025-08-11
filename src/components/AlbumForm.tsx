import { useState } from "react";

interface AlbumFormProps {
  closeForm: () => void;
  createAlbum: (albumData: {
    label: string;
    description: string;
    coverImage: string;
  }) => void;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ closeForm, createAlbum }) => {
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    coverImage: "https://pics.s4v.my/uploads/img_1754906756042_rwwosf8daij.jpg"
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Create New Album
        </h2>
        <input
          type="text"
          placeholder="Album Label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-600"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-600"
          rows={3}
        />
        <input
          type="url"
          placeholder="Cover Image URL"
          value={formData.coverImage}
          onChange={(e) =>
            setFormData({ ...formData, coverImage: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-6 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-600"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => createAlbum(formData)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            Create
          </button>
          <button
            onClick={() => {
              setFormData({
                label: "",
                description: "",
                coverImage: "https://iili.io/FQWcffV.jpg"
              });
              closeForm();
            }}
            className="bg-gray-700 text-gray-200 px-5 py-2 rounded-lg shadow hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumForm;
