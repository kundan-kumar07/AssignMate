import { useState } from "react";
import { UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="h-[70px] w-full px-4 sm:px-6 md:px-12 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 text-white relative z-50">
      
      {/* Logo */}
      <h1 className="text-indigo-400 font-bold text-lg sm:text-xl">
        AssignMate
      </h1>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">
        
        {/* Username */}
        <span className="text-gray-300 text-sm lg:text-base font-medium">
          👋 {user?.firstName || "User"}
        </span>

        {/* Profile */}
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-2xl focus:outline-none"
      >
        {open ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-black/90 backdrop-blur-md p-5 md:hidden shadow-lg border-t border-white/10">
          
          <div className="flex flex-col items-center gap-4">
            
            {/* Username */}
            <p className="text-gray-300 text-base font-medium">
              👋 {user?.fullName || "User"}
            </p>

            {/* User Button */}
            <UserButton afterSignOutUrl="/" />

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;