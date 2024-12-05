import React from "react";

function Layout({ children }) {
  return (
    <div className=" container scrollbar-hide  bg-bg bg-no-repeat border bg-cover w-svw h-svh md:max-w-md mx-auto px-5 py-5">
      {children}
    </div>
  );
}

export default Layout;
