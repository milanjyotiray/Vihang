import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logoImage from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img
                src={logoImage}
                alt="Vihang Logo"
                className="w-16 object-cover"
              />
              <div className="text-sm text-gray-400 font-normal mt-2">
                Give Wings to Stories
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting communities with helpers, one story at a time. Building bridges between those who need support and those ready to provide it.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-sky-blue-500 transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-sky-blue-500 transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-sky-blue-500 transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-sky-blue-500 transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/submit">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Submit Story</span>
                </Link>
              </li>
              <li>
                <Link href="/stories">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Browse Stories</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Join Network</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/stories?category=education">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Education</span>
                </Link>
              </li>
              <li>
                <Link href="/stories?category=health">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Health</span>
                </Link>
              </li>
              <li>
                <Link href="/stories?category=livelihood">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Livelihood</span>
                </Link>
              </li>
              <li>
                <Link href="/stories?category=other">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Infrastructure</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Vihang. Made with ❤️ for India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
