import React from "react";
import Link from "next/link"; // Import Link from Next.js



const Header = ({ isAuthenticated }) => {
  return (
    <header className="flex flex-wrap gap-5 justify-between px-10 py-0.5 w-full bg-white shadow-[0px_10px_10px_rgba(0,0,0,.3)] max-md:px-4 max-md:max-w-full mb-4">
      <div className="flex">
        {/* Wrap logo and site name in a Link to /home */}
        <Link href="/home">
          <div className="flex items-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b7e7d5b50ad0b92e2f3fe83c409f43cbec627707cccf34e74bf6288358e0971f?placeholderIfAbsent=true&apiKey=be7d969155c74017b8611192d433b602"
              alt="Logo 1"
              className="object-contain z-10 shrink-0 my-auto mr-0 max-w-full aspect-[2.3] w-[110px]" // Slightly smaller logo
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1f019f7c26ef2aaf00a3e32ef7f3eb972e91e2e9cdbe126d517a742ee5a8233?placeholderIfAbsent=true&apiKey=be7d969155c74017b8611192d433b602"
              alt="Logo 2"
              className="object-contain shrink-0 max-w-full aspect-square w-[90px]" // Slightly smaller logo
            />
            <span className="ml-2 text-2xl font-bold"></span>
          </div>
        </Link>
      </div>

      {/* Conditional rendering of the button based on authentication */}
      <nav className="flex gap-6 my-auto text-2xl tracking-normal leading-[38px] text-[color:var(--sds-color-text-brand-default)]">
        {true ? (
          <Link href="/calendar" className="overflow-hidden gap-2 self-stretch px-3 py-1 bg-green-300 rounded-lg border border-green-300 border-solid min-h-[40px] max-md:text-xl">
            Calendar
          </Link>
        ) : (
          <Link href="/login" className="overflow-hidden gap-2 self-stretch px-3 py-1 bg-green-300 rounded-lg border border-green-300 border-solid min-h-[40px] max-md:text-xl">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;