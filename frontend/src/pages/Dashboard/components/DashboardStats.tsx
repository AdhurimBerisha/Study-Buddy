interface DashboardStatsProps {
  stats: {
    users: {
      total: number;
      regular: number;
      admin: number;
      tutor: number;
      recent: number;
    };
    courses: {
      total: number;
      recent: number;
    };
    lessons: {
      total: number;
    };
    purchases: {
      total: number;
    };
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Platform Overview
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time statistics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Users
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.users.total}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {stats.users.recent} new this week
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Courses
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.courses.total}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {stats.courses.recent} new this week
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-600/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Tutors
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.users.tutor}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Expert instructors
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 dark:border-amber-700/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Lessons
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.lessons.total}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400">
              Learning content
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
