import { Briefcase } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Briefcase className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
        </div>

        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Finding amazing opportunities...
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner
