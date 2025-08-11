import { useState } from "react";

interface AlbumFormProps {
  createAlbum: (albumData: {
    label: string;
    description: string;
    coverImage: string;
  }) => void;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ createAlbum }) => {
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    coverImage: ""
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Album</h2>
        <input
          type="text"
          placeholder="Album Label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
          rows={3}
        />
        <input
          type="url"
          placeholder="Cover Image URL"
          value={formData.coverImage}
          onChange={(e) =>
            setFormData({ ...formData, coverImage: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            onClick={() => createAlbum(formData)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumForm;
