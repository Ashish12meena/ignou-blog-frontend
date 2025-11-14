import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Button, Input } from '@headlessui/react';
import JoditEditor from 'jodit-react';
import { useSelector } from 'react-redux';
import { addPost } from '../../services/PostService';
import { getCategories } from '../../services/CategoryService';
import { useNavigate } from 'react-router-dom';

const AddPost = ({ placeholder }) => {
  const { userId } = useSelector(state => state.user);
  const editor = useRef(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [image, setImage] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || 'Start typing your post content...',
    height: 400,
    buttons: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      '|',
      'outdent',
      'indent',
      'align',
      '|',
      'link',
      'image',
      '|',
      'undo',
      'redo'
    ],
  }), [placeholder]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      setLoadingCategories(true);
      try {
        const data = await getCategories();
        if (data && Array.isArray(data)) {
          setCategoriesList(data);
          setFilteredCategories(data);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoryList();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error && error.includes('title')) setError('');
  };

  const resetPost = () => {
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setImage(null);
    setCategorySearch('');
    setFilteredCategories(categoriesList);
    setShowDropdown(false);
    setError('');
  };

  const contentFieldChanged = (newContent) => {
    setContent(newContent);
    if (error && error.includes('content')) setError('');
  };

  const handleCategorySearch = (e) => {
    const searchText = e.target.value;
    setCategorySearch(searchText);
    setShowDropdown(true);

    if (searchText.trim() === '') {
      setFilteredCategories(categoriesList);
    } else {
      const matchedCategories = categoriesList
        .filter(cat => 
          cat.name.toLowerCase().includes(searchText.toLowerCase()) &&
          !selectedCategories.some(selected => selected.id === cat.id)
        )
        .sort((a, b) => {
          const matchA = a.name.toLowerCase().indexOf(searchText.toLowerCase());
          const matchB = b.name.toLowerCase().indexOf(searchText.toLowerCase());
          return matchA - matchB;
        });

      setFilteredCategories(matchedCategories);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    if (!selectedCategories.some(cat => cat.id === selectedCategory.id)) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
      if (error && error.includes('category')) setError('');
    }
    setCategorySearch('');
    setFilteredCategories(categoriesList.filter(cat => 
      !selectedCategories.some(selected => selected.id === cat.id) &&
      cat.id !== selectedCategory.id
    ));
    setShowDropdown(false);
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryId));
    const removedCategory = categoriesList.find(cat => cat.id === categoryId);
    if (removedCategory) {
      setFilteredCategories([...filteredCategories, removedCategory]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError('Image size should be less than 5MB');
          setImage(null);
        } else {
          setImage(file);
          if (error && error.includes('image')) setError('');
        }
      } else {
        setError('Please select a valid image file (JPEG/PNG)');
        setImage(null);
      }
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a post title');
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      setError('Please enter post content');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title.trim());
    formData.append("content", content);

    // Append each category ID
    selectedCategories.forEach(cat => {
      formData.append("category", cat.id);
    });

    if (image) {
      formData.append("postImage", image);
    }

    setLoading(true);

    try {
      const response = await addPost(formData);
      if (response && response.status === 200) {
        alert('Post created successfully!');
        resetPost();
        navigate('/home');
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error while adding post:', error);
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Post</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={createPost}>
        {/* Title Field */}
        <div className="mb-6">
          <label htmlFor="title" className="block font-semibold text-lg mb-2 text-gray-700">
            Post Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="title"
            placeholder="Enter an engaging title for your post"
            className="rounded-lg border border-gray-300 w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {/* Content Field */}
        <div className="mb-6">
          <label htmlFor="content" className="block font-semibold text-lg mb-2 text-gray-700">
            Post Content <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              onBlur={contentFieldChanged}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Categories Field */}
        <div className="mb-6">
          <label htmlFor="categorySearch" className="block font-semibold text-lg mb-2 text-gray-700">
            Categories <span className="text-red-500">*</span>
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Select at least one category)
            </span>
          </label>
          
          {loadingCategories ? (
            <div className="text-gray-500">Loading categories...</div>
          ) : (
            <>
              <div className="relative">
                <Input
                  type="text"
                  id="categorySearch"
                  placeholder="Search and select categories"
                  className="rounded-lg border border-gray-300 w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={categorySearch}
                  onChange={handleCategorySearch}
                  onFocus={() => setShowDropdown(true)}
                />

                {/* Dropdown with all available categories */}
                {showDropdown && filteredCategories.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <div className="font-medium text-gray-800">{cat.name}</div>
                        {cat.description && (
                          <div className="text-sm text-gray-500 mt-1">{cat.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showDropdown && filteredCategories.length === 0 && categorySearch && (
                  <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 p-3 shadow-lg">
                    <p className="text-gray-500 text-center">No categories found</p>
                  </div>
                )}
              </div>

              {/* Selected Categories Display */}
              {selectedCategories.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Selected Categories ({selectedCategories.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(cat => (
                      <span
                        key={cat.id}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 transition-colors"
                      >
                        {cat.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat.id)}
                          className="text-red-600 hover:text-red-800 font-bold ml-1"
                          title="Remove category"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCategories.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No categories selected yet. Please select at least one.
                </p>
              )}
            </>
          )}
        </div>

        {/* Image Upload Field */}
        <div className="mb-6">
          <label htmlFor="image" className="block font-semibold text-lg mb-2 text-gray-700">
            Post Banner Image <span className="text-gray-500 text-sm font-normal">(Optional)</span>
          </label>
          <Input 
            id="image" 
            type="file" 
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 file:cursor-pointer
              cursor-pointer"
          />
          {image && (
            <div className="mt-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700 font-medium">
                Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: JPEG, PNG, JPG. Maximum size: 5MB
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <Button 
            type="submit" 
            disabled={loading || loadingCategories}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Post...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Post
              </>
            )}
          </Button>
          <Button
            type="button"
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-md flex items-center gap-2"
            onClick={resetPost}
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;