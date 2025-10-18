const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#020618] shadow-inner ">
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
