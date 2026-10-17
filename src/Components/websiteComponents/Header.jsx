"use client";

import React, { useState, useEffect } from "react";
import { CiSearch, CiMenuBurger } from "react-icons/ci";
import { IoBagOutline, IoCloseOutline } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { lstocart } from "@/redux/features/cartsSlice";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Checkout", href: "/checkout" },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Redux cart state
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.item || [];

  const dispacher = useDispatch();
  useEffect(() => {
    dispacher(lstocart());
  }, [dispacher]);

  return (
    <header className="sticky top-0 left-0 z-50 w-full border-b border-amber-100 bg-[#faf2ed] shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 sm:min-h-18">
          {/* Logo + Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#5E3122] transition hover:bg-[#5e3122] hover:text-white md:hidden"
            >
              {isMenuOpen ? <IoCloseOutline /> : <CiMenuBurger />}
            </button>

            <Link
              href="/"
              className="text-lg font-bold tracking-wide text-[#5E3122] sm:text-xl lg:text-2xl"
            >
              NESTRO<span className="text-[#8C5A3C]">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded px-2.5 py-2 text-sm font-medium text-[#5E3122] transition duration-300 hover:bg-[#5e3122] hover:text-white lg:px-3 lg:text-base"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Admin Panel Direct Link for Admins */}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-full bg-[#1b2b3a] px-3 py-1.5 text-xs font-semibold text-teal-400 transition hover:bg-[#0f1d29]"
                  >
                    <MdOutlineAdminPanelSettings className="text-base" />
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Right Side Icons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#5E3122] transition hover:bg-[#5e3122] hover:text-white sm:h-10 sm:w-10 sm:text-2xl"
            >
              <IoBagOutline />

              {/* Cart Count */}
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5E3122] px-1 text-[10px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile / User */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  aria-label="Profile"
                  className="flex items-center gap-2 rounded-full border border-[#d6c4b7] bg-white/70 py-1 pl-1 pr-3 text-xs font-medium text-[#5E3122] transition hover:bg-white"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5E3122] text-xs font-bold text-white">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-24 truncate font-semibold">
                    {user?.name || "Account"}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-1.5 rounded-lg bg-[#5E3122] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#432318]"
              >
                <BsPersonCircle className="text-sm" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMenuOpen ? "max-h-125 pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="border-t border-amber-100 pt-3">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-[#5E3122] transition duration-300 hover:bg-[#5e3122] hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-lg bg-[#1b2b3a] px-3 py-3 text-sm font-semibold text-teal-400"
                  >
                    <MdOutlineAdminPanelSettings className="text-lg" />
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-[#5E3122] hover:bg-[#5e3122] hover:text-white"
                    >
                      My Profile ({user?.name})
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full text-left rounded-lg px-3 py-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/signin"
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-[#5E3122] hover:bg-[#5e3122] hover:text-white"
                  >
                    Sign in
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
