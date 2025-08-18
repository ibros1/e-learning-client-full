const Trusted = () => {
  return (
    <div>
      <section className="py-8 px-4 sm:px-6 bg-gray-100 dark:bg-gray-800/50  mx-auto">
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-70">
            {["Google", "Microsoft", "Amazon", "Netflix", "Spotify"].map(
              (company, index) => (
                <div
                  key={index}
                  className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-300"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trusted;
