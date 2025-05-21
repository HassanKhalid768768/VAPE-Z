import { Link } from "react-router-dom";

const Insights = () => {
  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Coming Soon</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Our website is currently under construction. Stay tuned for updates!
      </p>
      <div className="flex">
        <input
          type="text"
          placeholder="Enter your email address"
          className="py-2 px-4 rounded-l-md border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:border-gray-300"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-md border border-indigo-600"
        >
          Notify Me
        </button>
      </div>
      <div>
        <Link to="/dashboard/products">
          <button class="mt-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go Back to Products
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Insights;
