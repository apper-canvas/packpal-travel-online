import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md mx-auto"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon name="MapPin" className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-heading font-bold text-surface-900">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-surface-700">
            Looks like you're off the map!
          </h2>
          <p className="text-surface-600">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-200"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound