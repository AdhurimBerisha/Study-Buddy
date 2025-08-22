import { Link } from "react-router-dom";
import { FaCode, FaPlay, FaEye, FaTerminal, FaFileCode } from "react-icons/fa";

const preloadCodeEditor = () => {
  import("../../components/CodeEditor/CodeEditor");
};

const CodeEditorSection = () => {
  const features = [
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Multiple Languages",
      description:
        "Support for React, TypeScript, Vanilla JS, and more frameworks",
    },
    {
      icon: <FaEye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your code changes in real-time as you type",
    },
    {
      icon: <FaFileCode className="w-6 h-6" />,
      title: "File Management",
      description: "Organize your code with an intuitive file explorer",
    },
    {
      icon: <FaTerminal className="w-6 h-6" />,
      title: "Console Output",
      description: "Debug and test your code with built-in console",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Practice Coding in Real-Time
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our interactive code editor lets you write, test, and debug code
            instantly. Perfect for learning, practicing, or prototyping your
            next project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/code-editor"
                onMouseEnter={preloadCodeEditor}
                onFocus={preloadCodeEditor}
                className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaPlay className="w-4 h-4" />
                Start Coding Now
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm ml-2">
                  code-editor.js
                </span>
              </div>

              <div className="p-6 bg-gray-900 text-gray-100 font-mono text-sm">
                <div className="space-y-2">
                  <div className="text-blue-400">
                    function <span className="text-yellow-400">greet</span>(){" "}
                    {"{"}
                  </div>
                  <div className="ml-4 text-green-400">console.log</div>
                  <div className="ml-8 text-orange-400">"Hello, World!"</div>
                  <div className="ml-4 text-green-400">);</div>
                  <div>{"}"}</div>
                  <div className="text-gray-500"></div>
                  <div className="text-blue-400">greet</div>
                  <div className="text-gray-500">();</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <FaCode className="w-4 h-4" />
            <span>No setup required • Works in any browser • Free to use</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeEditorSection;
