import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../store/store";
import type { Course } from "../../types/course";
import { addToCart } from "../../store/slices/cart/cart";
import { useNavigate } from "react-router";

interface CourseCardProps {
  course: Course;
}
const EnrolleCourseDetail: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useSelector(
    (state: RootState) => state.loginSlice.data?.user
  );

  const handleAddToCart = () => {
    navigate("/checkout");
    const cartItem = {
      ...course,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
  };
  const handleRelogin = () => {
    navigate("/login");
  };

  return (
    <div>
      {!isLogin ? (
        <button
          onClick={handleRelogin}
          className="bg-blue-600 text-white px-6 py-3 w-full mt-4 rounded-xl text-lg hover:bg-blue-500 transition duration-300"
        >
          Login First
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-6 py-3 w-full mt-4 rounded-xl text-lg hover:bg-green-500 transition duration-300"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

export default EnrolleCourseDetail;
