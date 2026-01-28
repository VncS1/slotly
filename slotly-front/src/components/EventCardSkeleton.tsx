export function EventCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded-md"></div>
        <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
      </div>

      <div className="h-4 w-1/2 bg-gray-100 rounded-md mb-8"></div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
        <div className="h-9 bg-gray-100 rounded-lg"></div>
        <div className="h-9 bg-gray-100 rounded-lg"></div>
        <div className="h-9 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
}
