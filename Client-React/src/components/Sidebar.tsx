import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, FileText, Search, Users, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const MenuItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <Link to={createPageUrl(to)} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" onClick={onClick}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = ({ currentUser, handleLogout }) => {
  return (
    <aside className="fixed top-[61px] right-0 z-40 h-[calc(100vh-61px)] w-64 bg-white border-l">
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-1">
          <MenuItem to="Dashboard" icon={Home} label="ראשי" />
          {currentUser && currentUser.role === "מועמד" && (
            <MenuItem to="MyResume" icon={FileText} label="הרזומה שלי" />
          )}
          {currentUser && currentUser.role === "שדכן" && (
            <>
              <MenuItem to="Search" icon={Search} label="חיפוש רזומות" />
              <MenuItem to="Matches" icon={Users} label="שידוכים" />
              <MenuItem to="Statistics" icon={BarChart3} label="סטטיסטיקות" />
            </>
          )}
        </nav>
        {currentUser && (
          <div className="mt-auto border-t pt-4">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut size={18} className="ml-2" />
              התנתקות
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
