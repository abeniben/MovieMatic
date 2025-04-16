export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} MovieMatic
        </p>
      </div>
    </footer>
  );
}