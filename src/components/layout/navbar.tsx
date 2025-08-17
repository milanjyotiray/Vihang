import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
// import { useIsMobile } from "@/hooks/use-mobile";
import logoImage from "@/assets/logo.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Submit Story", href: "/submit" },
  { name: "Stories", href: "/stories" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isMobile = useIsMobile();

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigation.map((item) => (
        <Link key={item.name} href={item.href}>
          <Button
            variant="ghost"
            className={`${
              isActive(item.href)
                ? "text-saffron bg-saffron/10"
                : "text-gray-700 hover:text-saffron hover:bg-saffron/5"
            } ${mobile ? "w-full justify-start" : ""} transition-colors`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer" data-testid="logo-vihang">
              <img
                src={logoImage}
                alt="Vihang Logo"
                className="w-16 object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-white text-gray-900 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <img
                    src={logoImage}
                    alt="Vihang Logo"
                    className="h-8 w-auto"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="button-close-mobile-menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-2">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
