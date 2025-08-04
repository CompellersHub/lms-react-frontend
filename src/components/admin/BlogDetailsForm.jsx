import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "../admin/ImageUpload"; // Updated path

function BlogDetailsForm({ blog, setBlog, disabled = false }) {
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Handle changes for basic blog details (except title)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle title change and auto-generate slug
  const handleSlugChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setBlog((prev) => ({ ...prev, title: title, slug: slug }));
  };

  // Handle image upload
  const handleImageChange = (imageUrl) => {
    setBlog((prev) => ({ ...prev, image: imageUrl }));
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (currentTagInput.trim() && !blog.tags.includes(currentTagInput.trim())) {
      setBlog((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTagInput.trim()],
      }));
      setCurrentTagInput("");
    }
  };

  // Handle removing an existing tag
  const handleRemoveTag = (tagToRemove) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Blog Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={blog.title}
            onChange={handleSlugChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Slug (auto-generated from title)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={blog.slug}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={blog.category}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Status Selector */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={blog.status}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Featured Image Upload - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1">
            Featured Image <span className="text-red-500">*</span>
          </label>
          <ImageUpload
            value={blog.image}
            onChange={handleImageChange}
            disabled={disabled}
            placeholder="Upload featured image for your blog post"
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={blog.excerpt}
            onChange={handleChange}
            disabled={disabled}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          ></textarea>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Tags (Add and press Enter or click +)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={currentTagInput}
              onChange={(e) => setCurrentTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              disabled={disabled}
              placeholder="Type tag and press Enter"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={disabled}
              className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add tag"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-foreground rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  className="ml-2 text-foreground/70 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove tag ${tag}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailsForm;
