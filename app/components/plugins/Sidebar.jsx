import { useState } from 'react';
//import { FaArrowLeft, FaArrowRight, FaCalendar, FaClock, FaCog } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle && onToggle(!isOpen);
  };

  // return (
  //   <div
  //     className={`fixed left-0 top-0 h-screen bg-gray-800 text-white transition-all duration-300 ${
  //       isOpen ? 'w-48' : 'w-16'
  //     } z-50`}
  //   >
  //     <div className="flex h-full flex-col">
  //       <button
  //         onClick={toggleSidebar}
  //         className="absolute right-2 top-9 rounded-full hover:bg-gray-700 p-1"
  //       >
  //         {/* {isOpen ? <FaArrowLeft size={14} /> : <FaArrowRight size={14} />} */}
  //       </button>

  //       <div className="mt-20 flex flex-col items-center gap-8">
  //         {/* Calendar Link */}
  //         <Link href="/" className="w-full no-underline">
  //           <button className="flex w-full items-center p-4 hover:bg-gray-700 text-white">
  //             {/* <FaCalendar className="text-xl text-white" /> */}
  //             {isOpen && <span className="ml-4 text-white">Calendar</span>}
  //           </button>
  //         </Link>

  //         {/* Schedule Button */}
  //         <button className="flex w-full items-center p-4 hover:bg-gray-700 text-white">
  //           {/* <FaClock className="text-xl text-white" /> */}
  //           {isOpen && <span className="ml-4 text-white">Schedule</span>}
  //         </button>

  //         {/* Settings Link */}
  //         <Link href="/settings" className="w-full no-underline">
  //           <button className="flex w-full items-center p-4 hover:bg-gray-700 text-white">
  //             {/* <FaCog className="text-xl text-white" /> */}
  //             {isOpen && <span className="ml-4 text-white">Settings</span>}
  //           </button>
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );
  return(<div></div>)
};

export default Sidebar;