import React, { useState, useEffect, useRef } from 'react'
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenue, setShowMenue] = useState(false);
    const { token, setToken, userData } = useContext(AppContext)

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const logout = () => {
        setToken(false)
        localStorage.removeItem("token")
    }

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />

            {/* Desktop Navigation */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to="/">
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'><li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                </NavLink>

                <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">
                    <li className=' rounded-3xl border-gray-400 text-xs text-gray-700  inline-block border py-1 px-4'>Admin Panel</li>
                    <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />

                </a>
            </ul>

            <div className='flex items-center gap-4'>
                {/* If user is logged in */}
                {token && userData
                    ? (
                        <div
                            ref={dropdownRef}
                            className='flex items-center gap-2 cursor-pointer relative'
                            onClick={() => setDropdownVisible(prev => !prev)}
                        >
                            <img className="w-8 rounded-full " src={userData.image} alt="User" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />

                            {dropdownVisible && (
                                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-30'>
                                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                                        <p onClick={() => { navigate('my-profile'); setDropdownVisible(false); }} className='hover:text-black cursor-pointer'>My Profile</p>
                                        <p onClick={() => { navigate('my-appointments'); setDropdownVisible(false); }} className='hover:text-black cursor-pointer'>My Appointments</p>
                                        <p onClick={() => {
                                            setDropdownVisible(false);
                                            logout();
                                            navigate('/login'); // optional redirect
                                        }} className='hover:text-black cursor-pointer'>Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className='bg-indigo-500 text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>
                            Create Account
                        </button>
                    )}

                {/* Mobile Menu Button */}
                <img onClick={() => setShowMenue(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />

                {/* Mobile Menu */}
                <div className={`${showMenue ? 'fixed w-full' : 'h-0 w-0'} lg:hidden md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img className='w-36' src={assets.logo} alt="Logo" />
                        <img className='w-7' onClick={() => setShowMenue(false)} src={assets.cross_icon} alt="Close" />
                    </div>
                    <ul className='flex flex-col items-center'>
                        <NavLink onClick={() => setShowMenue(false)} to="/"><p className='px-4 py-2 rounded inline-block'>HOME</p>
                            <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => setShowMenue(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p>
                            <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => setShowMenue(false)} to="/contact"><p className='px-4 py-2 rounded inline-block'>CONTACT</p>
                            <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => setShowMenue(false)} to="/about"><p className='px-4 py-2 rounded inline-block'>ABOUT</p>
                            <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />
                        </NavLink>

                        <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">
                            <p className='  border-gray-400 text-xs text-gray-700 rounded-3xl py-1 px-4  inline-block border'>Admin Panel</p>
                            <hr className='border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden' />

                        </a>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
