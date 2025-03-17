import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-10 p-4 sm:p-6 md:p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Dashboard
			</h2>

			<div className='space-y-6'>
				{/* Profile Information Section */}
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-lg sm:text-xl font-semibold text-green-400 mb-2 sm:mb-3'>
						Profile Information
					</h3>
					<p className='text-gray-300 text-sm sm:text-base'>
						<span className='font-bold'>Name:</span> {user.name}
					</p>
					<p className='text-gray-300 text-sm sm:text-base'>
						<span className='font-bold'>Email:</span> {user.email}
					</p>
				</motion.div>

				{/* Account Activity Section */}
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-lg sm:text-xl font-semibold text-green-400 mb-2 sm:mb-3'>
						Account Activity
					</h3>
					<p className='text-gray-300 text-sm sm:text-base'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300 text-sm sm:text-base'>
						<span className='font-bold'>Last Login: </span> {formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			{/* Logout Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className='w-full py-2 sm:py-3 px-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};

export default DashboardPage;
