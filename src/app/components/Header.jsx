import React from "react";
import Link from "next/link"; // Import Link from Next.js

const Header = () => {
  return (
    <header className="flex flex-wrap gap-5 justify-between px-16 py-0.5 w-full bg-white shadow-[0px_10px_10px_rgba(0,0,0,.3)] max-md:px-5 max-md:max-w-full mb-8">
      <div className="flex">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b7e7d5b50ad0b92e2f3fe83c409f43cbec627707cccf34e74bf6288358e0971f?placeholderIfAbsent=true&apiKey=be7d969155c74017b8611192d433b602"
          alt=""
          className="object-contain z-10 shrink-0 my-auto mr-0 max-w-full aspect-[2.3] w-[173px]"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a1f019f7c26ef2aaf00a3e32ef7f3eb972e91e2e9cdbe126d517a742ee5a8233?placeholderIfAbsent=true&apiKey=be7d969155c74017b8611192d433b602"
          alt=""
          className="object-contain shrink-0 max-w-full aspect-square w-[150px]"
        />
      </div>
      <nav className="flex gap-8 my-auto text-5xl tracking-normal leading-[52px] text-[color:var(--sds-color-text-brand-default)]">
        <a
          href="#"
          className="overflow-hidden gap-2 self-stretch px-3 py-2 whitespace-nowrap bg-green-300 rounded-lg border border-green-300 border-solid min-h-[66px] max-md:text-4xl"
        >
          Home
        </a>
        <a
          href="#"
          className="overflow-hidden gap-2 self-stretch px-2 py-2 bg-green-300 rounded-lg border border-green-300 border-solid min-h-[66px] max-md:text-4xl"
        >
          Log in
        </a>
        {/* Calendar Button with Link */}
        <Link href="/calendar" className="overflow-hidden gap-2 self-stretch px-2 py-2 bg-green-300 rounded-lg border border-green-300 border-solid min-h-[66px] max-md:text-4xl">
            Calendar
        </Link>
      </nav>
    </header>
  );
};

export default Header;
