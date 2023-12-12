import React from "react";

const Header: React.FC = () => {
  return (
    <nav className="w-full bg-gray-100 shadow sticky top-0 z-50">
      <div className="container mx-auto p-2 max-w-6xl flex justify-between items-center">
        <div className="text-2xl  text-green-600">
          <span>Munch</span>
          <span className="font-bold">Metrics</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
