interface SpinnerProps {
  size?: string; // e.g. "w-6 h-6"
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "w-6 h-6",
  className = "",
}) => (
  <svg
    className={`animate-spin text-white ${size} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    aria-label="Loading"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
    loading...
  </svg>
);

export default Spinner;
