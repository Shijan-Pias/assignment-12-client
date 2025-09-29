
import { FaLock } from "react-icons/fa";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <FaLock className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Access Forbidden</h2>
      <p className="mb-6 text-center max-w-md">
        Sorry, you do not have permission to view this page. 
        Please contact the administrator if you believe this is an error.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
