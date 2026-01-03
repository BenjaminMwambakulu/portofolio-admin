export default function ProjectsLayoutPicker({
  selectedLayout,
  setSelectedLayout,
}) {
  const baseStyles =
    "relative aspect-[16/9] w-full rounded-lg border bg-gray-100 p-2 transition hover:border-blue-500 focus:outline-none";

  const selectedStyles = "border-blue-600 ring-2 ring-blue-500";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {/* Layout 1: Grid Cards */}
      <button
        onClick={() => setSelectedLayout("layout1")}
        title="Grid cards layout"
        className={`${baseStyles} ${
          selectedLayout === "layout1" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="grid grid-cols-2 gap-1 h-full">
          <div className="bg-white rounded p-1">
            <div className="h-8 bg-gray-300 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="bg-white rounded p-1">
            <div className="h-8 bg-gray-300 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </button>

      {/* Layout 2: Masonry Grid */}
      <button
        title="Masonry grid layout"
        onClick={() => setSelectedLayout("layout2")}
        className={`${baseStyles} ${
          selectedLayout === "layout2" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="grid grid-cols-2 gap-1 h-full">
          <div className="bg-white rounded p-1">
            <div className="h-12 bg-gray-300 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="bg-white rounded p-1">
            <div className="h-6 bg-gray-300 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded mb-1" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </button>

      {/* Layout 3: List View */}
      <button
        title="List view layout"
        onClick={() => setSelectedLayout("layout3")}
        className={`${baseStyles} ${
          selectedLayout === "layout3" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="bg-white rounded p-1 space-y-1 h-full">
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-300 rounded" />
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded mb-1" />
              <div className="h-1 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-300 rounded" />
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded mb-1" />
              <div className="h-1 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

