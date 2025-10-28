import React, { useState } from 'react';
import { MdMenuOpen } from "react-icons/md";
import { IoHomeOutline, IoSearchOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { TbLogout } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { GoPerson } from "react-icons/go";
import { IoAdd } from "react-icons/io5";
import logo from "../../assets/images/Bloggera.svg";
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const profilePicture = localStorage.getItem('profilePicture');

  const navigate = useNavigate();

  const menuItems = [
    { icons: <IoHomeOutline size={30} />, label: 'Home', path: '/' },
    { icons: <IoSearchOutline size={30} />, label: 'Explore', path: '/explore' },
    { icons: <TfiWrite size={30} />, label: 'Write', path: '/write/post' },
    { icons: <CiSettings size={30} />, label: 'Setting', path: '/settings' },
    { icons: <GoPerson size={30} />, label: 'Profile', path: '/profile' }
  ];

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/start');
  };

  const handleMenuClick = (path) => {
    setActiveIcon(path);
    navigate(path);
  };

  if (!userId) return null;

  return (
    <div className={`flex h-screen p-4 ${open ? 'md:ml-52 ml-10' : 'md:ml-10 ml-10'}`}>
      <nav className={`shadow-md h-screen z-50 p-2 flex flex-col bg-gray-100 text-black fixed top-0 left-0 ${open ? 'w-60' : 'w-16'} duration-500`}>
        <div className='px-3 py-2 h-20 flex justify-between items-center'>
          <img src={logo} alt="Logo" className={`${open ? 'w-30' : 'w-0'} rounded-md`} />
          <MdMenuOpen size={34} className={`cursor-pointer duration-500 ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)} />
        </div>

        <ul className='flex-1'>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group 
              ${activeIcon === item.path ? 'shadow-md bg-gray-300' : 'hover:bg-gray-500'}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <div>{item.icons}</div>
              <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
              <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}>{item.label}</p>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-2 px-3 py-2 relative'>
          <button className='flex cursor-pointer hover:bg-gray-200 rounded-full' onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <img
                src={profilePicture || "https://via.placeholder.com/150"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
              <span className='text-gray-500 m-1.5'>{username}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute border border-gray-400 left-full bottom-0 ml-2 bg-white shadow-lg rounded-md p-3 w-48">
              <button
                className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                onClick={() => alert('Add account')}
              >
                <IoAdd size={18} />
                Add account
              </button>
              <button
                className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                onClick={handleLogOut}
              >
                <TbLogout size={18} />
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}