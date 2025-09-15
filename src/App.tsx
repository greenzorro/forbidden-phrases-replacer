import Logo from '@components/Logo';
import ThemeToggle from '@components/ThemeToggle';
import RuleEditor from '@components/RuleEditor';
import TextProcessor from '@components/TextProcessor';
import FileUploader from '@components/FileUploader';

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/90 dark:bg-[#151520]/90 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full flex flex-col lg:flex-row lg:gap-6">
          {/* Left Sidebar - Rules */}
          <div className="lg:w-64 flex flex-col flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white dark:bg-[#1a1a24] rounded-lg shadow-none lg:shadow-lg p-4 h-auto lg:h-full overflow-y-auto">
              <RuleEditor />
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col space-y-4 lg:space-y-4">
            {/* Text Processing Section */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-4 mt-2 sm:mt-4">单条替换</h2>
              <div className="flex-1">
                <TextProcessor />
              </div>
            </div>

            {/* File Processing Section */}
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-4 mt-2 sm:mt-4">批量替换</h2>
              <div className="min-h-[128px] lg:h-32">
                <FileUploader />
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 text-center text-xs text-gray-500 dark:text-gray-400 py-2">
              <p>Created by <a href="https://victor42.work/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80">Victor_42</a> | <a href="https://github.com/greenzorro/forbidden-phrases-replacer" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80">Code</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;