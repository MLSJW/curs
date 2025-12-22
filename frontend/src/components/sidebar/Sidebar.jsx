import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileDrawer from "./ProfileDrawer";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="mr-2 p-2 rounded hover:bg-slate-700 transition-colors focus:outline-none"
        >
          <FiMenu className="w-6 h-6 text-slate-300" />
        </button>
        <div className="flex-1">
          <SearchInput />
        </div>
      </div>
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton />
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default Sidebar;