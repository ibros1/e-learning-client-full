const CTA = () => {
  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Ready to start learning?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their careers with
            our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => window.location.assign("/signup")}
              className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-indigo-600 rounded-lg font-medium shadow-md hover:bg-gray-100 transition text-sm md:text-base"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => window.location.assign("/courses")}
              className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition text-sm md:text-base"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </section>{" "}
    </div>
  );
};

export default CTA;
