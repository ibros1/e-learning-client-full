import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { listCoursesFn } from "../store/slices/courses/listCourse";
import { listUsersFn } from "../store/slices/auth/user/getAllUsers";

interface SearchProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: "course" | "member";
  name: string;
  imageUrl?: string;
  role?: string; // Add role for users
}

const Search = ({ onClose }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Get courses and users from Redux store
  const courses = useSelector(
    (state: RootState) => state.listCoursesSlice.data?.courses || []
  );
  const users = useSelector(
    (state: RootState) => state.listUsersSlice.data?.users || []
  );

  // Fetch data on component mount
  useEffect(() => {
    if (!courses.length) {
      dispatch(listCoursesFn());
    }
    if (!users.length) {
      dispatch(listUsersFn());
    }
  }, [dispatch, courses.length, users.length]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  const fetchResults = (value: string) => {
    if (!value.trim()) {
      setResults([]);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      try {
        // Map courses to search results
        const courseResults: SearchResult[] = courses.map((course) => ({
          id: course.id.toString(),
          type: "course",
          name: course.title,
          imageUrl: course.course_img,
        }));

        // Map users to search results
        const userResults: SearchResult[] = users.map((user) => ({
          id: user.id.toString(),
          type: "member",
          name: user.full_name || user.username || "Unknown User",
          imageUrl: user.profilePhoto,
          role: user.role, // Add user role
        }));

        // Combine and filter results
        const allResults = [...courseResults, ...userResults];
        const filtered = allResults.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );

        if (filtered.length > 0) {
          setResults(filtered);
          setNotFound(false);
        } else {
          setResults([]);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setNotFound(true);
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev >= results.length - 1 ? 0 : prev + 1));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
          break;

        case "Enter":
          if (activeIndex >= 0 && activeIndex < results.length) {
            const item = results[activeIndex];
            navigate(
              item.type === "course"
                ? `/courses/${item.id}`
                : `/member/${item.id}`
            );
            onClose();
          } else if (query.trim()) {
            handleSearch();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, results, query]);

  const handleSearch = () => {
    if (results.length > 0) {
      const item = activeIndex >= 0 ? results[activeIndex] : results[0];
      navigate(
        item.type === "course" ? `/courses/${item.id}` : `/member/${item.id}`
      );
      onClose();
    } else {
      setNotFound(true);
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/60">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col backdrop-blur-sm bg-black/30"
      aria-modal="true"
      role="dialog"
      aria-label="Search dialog"
    >
      <div
        ref={searchRef}
        className="bg-gray-100 py-4 dark:bg-gray-800 shadow flex flex-col"
      >
        {/* Search bar */}
        <div className="flex items-center w-full md:w-[80%] lg:w-[60%] gap-4 justify-between mx-auto px-4 h-16">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses or users..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchResults(e.target.value);
              }}
              autoFocus
              className="w-full rounded-xl px-4 py-3 pl-12 focus:outline-blue-600 dark:bg-gray-900 dark:text-gray-200"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={results.length > 0 || notFound}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            className="ml-3 text-2xl font-bold text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        {/* Results section */}
        <div
          id="search-results"
          className="overflow-y-auto bg-white/80 dark:bg-gray-900/80 rounded-b-xl shadow-lg max-h-[60vh] mt-2 w-full md:w-[80%] lg:w-[60%] mx-auto"
        >
          {loading && (
            <div className="flex justify-center items-center py-6 gap-3">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-300">
                Searching...
              </span>
            </div>
          )}

          {!loading && query && results.length === 0 && !notFound && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              Start typing to search courses and users
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="divide-y divide-gray-300/60 dark:divide-gray-700/60">
              {results.map((item, index) => (
                <li
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    navigate(
                      item.type === "course"
                        ? `/courses/${item.id}`
                        : `/members/${item.id}`
                    );
                    onClose();
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === activeIndex
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/80"
                  }`}
                  aria-selected={index === activeIndex}
                >
                  <div className="flex items-center gap-3">
                    {/* Image with fallback */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {highlightMatch(item.name, query)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize flex items-center gap-2">
                        <span>{item.type}</span>
                        {item.role && (
                          <>
                            <span className="text-gray-300 dark:text-gray-600">
                              •
                            </span>
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                              {item.role}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && notFound && (
            <div className="text-center p-6">
              <div className="text-red-500 font-medium mb-1">
                No results found for "{query}"
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try different keywords
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
