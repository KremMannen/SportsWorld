import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 mt-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* SportsWorld.com Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">SportsWorld.com</h3>
          <hr className="border-red-600 mb-4" />
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-red-300">
                About SportsWorld.com
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-300">
                Cookies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-300">
                Privacy Statement
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Contact</h3>
          <hr className="border-red-600 mb-4" />
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:info@sportsworld.com"
                className="hover:text-red-300"
              >
                info@sportsworld.com
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="hover:text-red-300">
                +1 (234) 567-890
              </a>
            </li>
            <li className="hover:text-red-300">123 Sports Ave, City, State</li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Follow Us</h3>
          <hr className="border-red-600 mb-4" />
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-red-300">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-300">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-300">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2024 SportsWorld.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
