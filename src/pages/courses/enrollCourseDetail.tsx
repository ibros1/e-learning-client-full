import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/store";
import type { Course } from "../../types/course";
import { addToCart } from "../../store/slices/cart/cart";
import { useNavigate } from "react-router";

interface CourseCardProps {
  course: Course;
}
const EnrolleCourseDetail: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    navigate("/checkout");
    const cartItem = {
      ...course,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="bg-green-600 text-white px-6 py-3 w-full mt-4 rounded-xl text-lg hover:bg-green-500 transition duration-300"
      >
        Enroll Now
      </button>
    </div>
  );
};

export default EnrolleCourseDetail;
