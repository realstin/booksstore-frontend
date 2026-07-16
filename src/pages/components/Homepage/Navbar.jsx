import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Container from "../../../components/Container";
import Button from "../../../components/Button";

const navLinks = [
  { name: "Explore", href: "#explore" },
  { name: "Features", href: "#features" },
  { name: "Library", href: "#library" },
  { name: "About", href: "#about" },
];

const linkClass =
  "text-[14.5px] font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-950";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerClass = scrolled
    ? "sticky top-0 z-50 border-b transition-all duration-300 border-neutral-200/80 bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,20,25,0.04),0_12px_24px_-16px_rgba(15,20,25,0.12)]"
    : "sticky top-0 z-50 border-b transition-all duration-300 border-neutral-100 bg-white";

  const navClass = scrolled
    ? "flex items-center justify-between transition-all duration-300 h-16"
    : "flex items-center justify-between transition-all duration-300 h-20";

  const logoImgClass = scrolled
    ? "select-none transition-all duration-300 h-6 w-6"
    : "select-none transition-all duration-300 h-7 w-7";

  const logoTextClass = scrolled
    ? "font-semibold tracking-tight text-neutral-950 transition-all duration-300 text-[19px]"
    : "font-semibold tracking-tight text-neutral-950 transition-all duration-300 text-[21px]";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={headerClass}
    >
      <Container>
        <nav className={navClass}>
          <Link to="/homepage" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <img src="/bookstorelogo.svg" alt="BookStore Logo" className={logoImgClass} />
            <span className={logoTextClass}>BookStore</span>
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className={linkClass}>
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <Link to="/login" className="text-[14.5px] font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-950">
              Log in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition hover:bg-neutral-100 active:scale-95 lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-neutral-100 bg-white lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.05 * i }}
                  className="rounded-xl px-3 py-3 text-[16px] font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
                >
                  {link.name}
                </motion.a>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-5">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-center text-[16px] font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
                >
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;