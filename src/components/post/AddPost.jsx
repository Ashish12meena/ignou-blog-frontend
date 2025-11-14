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
  const [category, setCategory] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [image, setImage] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || 'Start typing...',
    height: 400,
  }), [placeholder]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const data = await getCategories();
        setCategoriesList(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };
    fetchCategoryList();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError('');
  };

  const resetPost = () => {
    setTitle('');
    setContent('');
    setCategory([]);
    setImage(null);
    setCategorySearch('');
    setFilteredCategories([]);
    setError('');
  };

  const contentFieldChanged = (newContent) => {
    setContent(newContent);
    setError('');
  };

  const handleCategorySearch = (e) => {
    const searchText = e.target.value;
    setCategorySearch(searchText);

    if (searchText.trim() === '') {
      setFilteredCategories([]);
      return;
    }

    const matchedCategories = categoriesList
      .filter(cat => cat.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const matchA = a.name.toLowerCase().indexOf(searchText.toLowerCase());
        const matchB = b.name.toLowerCase().indexOf(searchText.toLowerCase());
        return matchA - matchB;
      })
      .slice(0, 4);

    setFilteredCategories(matchedCategories);
  };

  const handleCategorySelect = (selectedCategory) => {
    if (!category.some(cat => cat.id === selectedCategory.id)) {
      setCategory([...category, selectedCategory]);
    }
    setCategorySearch('');
    setFilteredCategories([]);
  };

  const handleRemoveCategory = (categoryId) => {
    setCategory(category.filter(cat => cat.id !== categoryId));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
      setError('');
    } else {
      setError('Please select a valid image file (JPEG/PNG)');
      setImage(null);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    if (category.length === 0) {
      setError('Please select at least one category');
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("content", content);

    category.forEach(cat => formData.append("category", cat.id));

    if (image) {
      formData.append("postImage", image);
    }

    setLoading(true);

    try {
      const response = await addPost(formData);
      if (response.status === 200) {
        resetPost();
        alert('Post created successfully!');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error while adding post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={createPost}>
        <div className="my-3">
          <label htmlFor="title" className="font-semibold text-lg">Post Title *</label>
          <Input
            type="text"
            id="title"
            placeholder="Enter post title"
            className="rounded-md border border-gray-300 w-full p-2 mt-2"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="content" className="font-semibold text-lg">Post Content *</label>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={contentFieldChanged}
            onChange={() => {}}
          />
        </div>

        <div className="my-3 relative">
          <label htmlFor="categorySearch" className="font-semibold text-lg">Categories *</label>
          <Input
            type="text"
            id="categorySearch"
            placeholder="Search and select categories"
            className="rounded-md border border-gray-300 w-full p-2 mt-2"
            value={categorySearch}
            onChange={handleCategorySearch}
          />

          {filteredCategories.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
              {filteredCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}

          {category.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {category.map(cat => (
                <span
                  key={cat.id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <label htmlFor="image" className="font-semibold text-lg">Post Banner (Optional)</label>
          <Input 
            id="image" 
            type="file" 
            accept="image/jpeg,image/png"
            onChange={handleFileChange} 
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {image && (
            <p className="mt-2 text-sm text-green-600">Selected: {image.name}</p>
          )}
        </div>

        <div className="text-center mt-6 flex gap-2 justify-center">
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-md py-2 px-6 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
          <Button
            type="button"
            className="rounded-md py-2 px-6 bg-red-500 text-white hover:bg-red-600"
            onClick={resetPost}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;