const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 px-6 md:px-20 border-t dark:bg-[#091025] dark:text-gray-300">
      {/* Bottom */}
      <div className="p-4 text-center text-sm items-center">
        © {new Date().getFullYear()} SURMAD. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
