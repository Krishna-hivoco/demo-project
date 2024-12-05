import Reacts from 'react'
import { IoArrowBack } from 'react-icons/io5';

function BackLayout({children}) {
  return (
    <div className="container scrollbar-hide  bg-bg bg-no-repeat border bg-cover w-svw h-svh md:max-w-md mx-auto px-5 py-5">
      <>{children}</>
    </div>
  );
}

export default BackLayout