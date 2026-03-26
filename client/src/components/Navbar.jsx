import { useState } from "react";
import { UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="h-[70px] w-full px-6 md:px-16 flex items-center justify-between bg-white shadow-md">

      {/* Logo */}
      <h1 className="text-indigo-600 font-bold text-xl">
        AssignMate
      </h1>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">

        {/* User Name */}
        <span className="text-gray-700 font-medium">
          {user?.fullName}
        </span>

        {/* Profile Image + Dropdown */}
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-xl"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-white p-6 md:hidden shadow-md">
          <ul className="flex flex-col gap-4 text-gray-700">

            <li className="font-medium">
              {user?.fullName}
            </li>

            <li>
              <UserButton afterSignOutUrl="/" />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;