import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Button, Input } from '@headlessui/react';
import JoditEditor from 'jodit-react';
import { useSelector } from 'react-redux';
import { addPost } from '../../services/PostService';
import { getCategories } from '../../services/CategoryService';

const AddPost = ({ placeholder }) => {
  const { userId } = useSelector(state => state.user);
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); // Renamed state to categoriesList
  const [image, setImage] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || 'Start typing...'
  }), [placeholder]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const data = await getCategories();
        setCategoriesList(data); // Assuming data is an array of { id, name } objects
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategoryList()
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const resetPost = () => {
    setTitle('');
    setContent('');
    setCategory([]);
    setImage(null);
    setCategorySearch('');
    setFilteredCategories([]);
  };

  const contentFieldChanged = (newContent) => {
    setContent(newContent);
  };

  // Handle category search input
  const handleCategorySearch = (e) => {
    const searchText = e.target.value;
    setCategorySearch(searchText);

    if (searchText.trim() === '') {
      setFilteredCategories([]);
      return;
    }

    const matchedCategories = categoriesList
      .filter(cat => cat.name.toLowerCase().includes(searchText.toLowerCase())) // Filtering by name
      .sort((a, b) => {
        const matchA = a.name.toLowerCase().indexOf(searchText.toLowerCase());
        const matchB = b.name.toLowerCase().indexOf(searchText.toLowerCase());

        // Prioritize categories where the search text appears earlier in the string
        return matchA - matchB;
      })
      .slice(0, 4); // Limit the number of suggestions

    setFilteredCategories(matchedCategories);
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (selectedCategory) => {
    if (!category.some(cat => cat.id === selectedCategory.id)) { // Prevent duplicate categories
      setCategory([...category, selectedCategory]);
    }
    setCategorySearch('');
    setFilteredCategories([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
    } else {
      alert('Please select a valid image file (JPEG/PNG)');
    }
  };

  const createPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("content", content);

    category.forEach(cat => formData.append("category", cat.id)); // Use id for categories

    if (image) {
      formData.append("postImage", image);
    }

    try {
      const response = await addPost(formData);
      if (response.status === 200) {
        resetPost();
      }
    } catch (error) {
      console.error('Error while adding post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <form onSubmit={createPost}>
        <div className="my-3">
          <label htmlFor="title" className="font-semibold text-lg">Post title</label>
          <Input
            type="text"
            id="title"
            placeholder="Enter here"
            className="rounded-md border border-gray-300 w-full p-2 mt-2"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="my-3">
          <label htmlFor="content" className="font-semibold text-lg">Post Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={contentFieldChanged}
          />
        </div>

        <div className="my-3 relative">
          <label htmlFor="categorySearch" className="font-semibold text-lg">Search Category</label>
          <Input
            type="text"
            id="categorySearch"
            placeholder="Search category"
            className="rounded-md border border-gray-300 w-full p-2 mt-2"
            value={categorySearch}
            onChange={handleCategorySearch}
          />

          {filteredCategories.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
              {filteredCategories.map((cat) => (
                <li
                  key={cat.id} // Using 'id' as key
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategorySelect(cat)} // Pass the whole category object
                >
                  {cat.name}  {/* Displaying category name */}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-2 text-gray-600">Selected Categories: {category.map(cat => cat.name).join(", ")}</p>
        </div>

        <div className="mt-3">
          <label htmlFor="image" className="font-semibold text-lg">Select Post banner</label>
          <Input id="image" type="file" onChange={handleFileChange} className="mt-2" />
        </div>

        <div className="text-center mt-6">
          <Button type="submit" className="rounded-md py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
            Create Post
          </Button>
          <Button
            type="button"
            className="rounded-md py-2 px-4 bg-red-500 text-white hover:bg-red-600 ms-2"
            onClick={resetPost}
          >
            Reset Content
          </Button>
        </div>
      </form>

      {/* Debugging */}
      <div>{title}</div>
      <div>{content}</div>
      <div>{category.map(cat => cat.name).join(", ")}</div>
    </div>
  );
};

export default AddPost;
