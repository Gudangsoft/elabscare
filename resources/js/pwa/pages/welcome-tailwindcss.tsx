

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-20 translate-y-32 -translate-x-32"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-6">
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    ))}
                </div>
                <button className="text-white text-lg font-medium">Skip</button>
            </div>

            {/* Main illustration area */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="relative">
                    {/* Cloud background */}
                    <div className="absolute inset-0 bg-gray-200 rounded-full opacity-80 w-96 h-64 -z-10"></div>

                    {/* Workspace illustration */}
                    <div className="relative z-10 p-8">
                        {/* Clock */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center">
                                <div className="w-1 h-4 bg-gray-800 rounded-full transform rotate-12 origin-bottom"></div>
                                <div className="w-0.5 h-3 bg-gray-800 rounded-full transform -rotate-45 origin-bottom absolute"></div>
                            </div>
                        </div>

                        {/* Desk and people */}
                        <div className="flex items-end space-x-8 mt-16">
                            {/* Person 1 - Sitting */}
                            <div className="flex flex-col items-center">
                                {/* Head */}
                                <div className="w-8 h-8 bg-yellow-200 rounded-full mb-1"></div>
                                {/* Hair */}
                                <div className="w-10 h-6 bg-gray-800 rounded-t-full -mt-7 mb-1"></div>
                                {/* Body */}
                                <div className="w-12 h-16 bg-red-500 rounded-t-lg"></div>
                                {/* Arms */}
                                <div className="flex space-x-8 -mt-8">
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                </div>
                                {/* Skirt */}
                                <div className="w-16 h-8 bg-blue-900 rounded-b-lg -mt-4"></div>
                                {/* Legs */}
                                <div className="flex space-x-2 mt-2">
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                </div>
                                {/* Shoes */}
                                <div className="flex space-x-1">
                                    <div className="w-4 h-3 bg-red-600 rounded-full"></div>
                                    <div className="w-4 h-3 bg-red-600 rounded-full"></div>
                                </div>
                                {/* Chair */}
                                <div className="w-14 h-6 bg-yellow-400 rounded -mt-12 -z-10"></div>
                                <div className="w-2 h-8 bg-blue-600 -mt-2"></div>
                            </div>

                            {/* Desk */}
                            <div className="w-32 h-4 bg-yellow-400 rounded"></div>

                            {/* Person 2 - Standing */}
                            <div className="flex flex-col items-center">
                                {/* Head */}
                                <div className="w-8 h-8 bg-yellow-200 rounded-full mb-1"></div>
                                {/* Hair */}
                                <div className="w-10 h-6 bg-gray-800 rounded-t-full -mt-7 mb-1"></div>
                                {/* Body */}
                                <div className="w-12 h-16 bg-yellow-500 rounded-t-lg"></div>
                                {/* Arms */}
                                <div className="flex space-x-8 -mt-8">
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                </div>
                                {/* Pants */}
                                <div className="w-10 h-12 bg-blue-900 rounded-b-lg -mt-4"></div>
                                {/* Legs */}
                                <div className="flex space-x-2 mt-2">
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                    <div className="w-3 h-8 bg-yellow-200 rounded-full"></div>
                                </div>
                                {/* Shoes */}
                                <div className="flex space-x-1">
                                    <div className="w-4 h-3 bg-gray-800 rounded-full"></div>
                                    <div className="w-4 h-3 bg-gray-800 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Desk items */}
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            <div className="w-8 h-6 bg-gray-300 rounded"></div> {/* Computer */}
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div> {/* Apple */}
                            <div className="w-2 h-4 bg-blue-400 rounded"></div> {/* Bottle */}
                            <div className="w-4 h-1 bg-orange-400 rounded"></div> {/* Book */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content section */}
            <div className="px-8 pb-8 text-center text-white">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                    Build your website easier with Affan
                </h1>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                    Affan is a modern and latest technology based PWA mobile HTML template.
                </p>

                {/* Get Started Button */}
                <button className="w-full bg-yellow-400 text-gray-800 py-4 rounded-2xl text-xl font-semibold hover:bg-yellow-300 transition-colors">
                    Get Started
                </button>
            </div>
        </div>
    );
}