export default function SkillsLayoutPicker({
  selectedLayout,
  setSelectedLayout,
}) {
  const baseStyles =
    "relative aspect-[16/9] w-full rounded-lg border bg-gray-100 p-2 transition hover:border-blue-500 focus:outline-none";

  const selectedStyles = "border-blue-600 ring-2 ring-blue-500";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {/* Layout 1: Tab Navigation with Skills Grid */}
      <button
        onClick={() => setSelectedLayout("layout1")}
        title="Tab navigation with skills grid"
        className={`${baseStyles} ${
          selectedLayout === "layout1" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="flex flex-col h-full gap-2">
          {/* Tab bar */}
          <div className="bg-white rounded p-1 flex gap-1">
            <div className="h-1.5 bg-blue-500 rounded flex-1" />
            <div className="h-1.5 bg-gray-200 rounded flex-1" />
            <div className="h-1.5 bg-gray-200 rounded flex-1" />
          </div>
          {/* Skills grid */}
          <div className="bg-white rounded p-1 flex flex-wrap gap-1 flex-1">
            <div className="h-2 bg-gray-300 rounded w-1/4" />
            <div className="h-2 bg-gray-300 rounded w-1/4" />
            <div className="h-2 bg-gray-300 rounded w-1/4" />
            <div className="h-2 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
      </button>

      {/* Layout 2: Simple Grid */}
      <button
        title="Simple skills grid"
        onClick={() => setSelectedLayout("layout2")}
        className={`${baseStyles} ${
          selectedLayout === "layout2" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="bg-white rounded p-2 flex flex-wrap gap-2 h-full">
          <div className="h-3 bg-gray-300 rounded w-1/5" />
          <div className="h-3 bg-gray-300 rounded w-1/5" />
          <div className="h-3 bg-gray-300 rounded w-1/5" />
          <div className="h-3 bg-gray-300 rounded w-1/5" />
          <div className="h-3 bg-gray-300 rounded w-1/5" />
        </div>
      </button>

      {/* Layout 3: List View */}
      <button
        title="List view"
        onClick={() => setSelectedLayout("layout3")}
        className={`${baseStyles} ${
          selectedLayout === "layout3" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="bg-white rounded p-1.5 space-y-1 h-full">
          <div className="h-2 bg-gray-200 rounded" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
          <div className="h-2 bg-gray-200 rounded w-4/6" />
          <div className="h-2 bg-gray-200 rounded w-3/6" />
        </div>
      </button>
    </div>
  );
}

