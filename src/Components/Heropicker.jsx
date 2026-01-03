export default function HeroLayoutPicker({
  selectedLayout,
  setSelectedLayout,
}) {
  const baseStyles =
    "relative aspect-[16/9] w-full rounded-lg border bg-gray-100 p-2 transition hover:border-blue-500 focus:outline-none";

  const selectedStyles = "border-blue-600 ring-2 ring-blue-500";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {/* Layout 1: Text Left, Image Right */}
      <button
        onClick={() => setSelectedLayout("layout1")}
        title="text left, image right"
        className={`${baseStyles} ${
          selectedLayout === "layout1" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="grid grid-cols-2 gap-2 h-full">
          <div className="bg-white rounded p-1 space-y-1">
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="bg-gray-300 rounded" />
        </div>
      </button>

      {/* Layout 2: Image Left, Text Right */}
      <button
        title="image left, text right"
        onClick={() => setSelectedLayout("layout2")}
        className={`${baseStyles} ${
          selectedLayout === "layout2" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="grid grid-cols-2 gap-2 h-full">
          <div className="bg-gray-300 rounded" />
          <div className="bg-white rounded p-1 space-y-1">
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </button>

      {/* Layout 3: Centered Text */}
      <button
        title="Centered Text"
        onClick={() => setSelectedLayout("layout3")}
        className={`${baseStyles} ${
          selectedLayout === "layout3" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="h-2 bg-white rounded mb-2" />
        <div className="bg-white rounded h-full flex flex-col items-center justify-center gap-2 p-2">
          <div className="h-2 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
      </button>

      {/* Layout 4: Full Image with Text Overlay */}
      <button
        title="full image with text overlay"
        onClick={() => setSelectedLayout("layout4")}
        className={`${baseStyles} ${
          selectedLayout === "layout4" ? selectedStyles : "border-gray-300"
        }`}
      >
        <div className="relative h-full rounded overflow-hidden">
          <div className="absolute inset-0 bg-gray-300" />
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded p-1 space-y-1">
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </button>

      {/* Layout 5: Text on top, Image below */}
      <button
        title="text on top, image below"
        onClick={() => setSelectedLayout("layout5")}
        className={`${baseStyles} ${
          selectedLayout === "layout5" ? selectedStyles : "border-gray-300"
        }`}
      >
        {/* Header */}
        <div className="h-2 bg-white rounded mb-1" />

        {/* Content */}
        <div className="flex flex-col h-full gap-2">
          {/* Text block */}
          <div className="bg-white rounded p-1.5 space-y-1">
            <div className="h-2 bg-gray-200 rounded w-4/5" />
            <div className="h-2 bg-gray-200 rounded w-3/5" />
            <div className="h-2 bg-gray-200 rounded w-2/5" />
          </div>

          {/* Image block */}
          <div className="bg-gray-300 rounded flex-1" />
        </div>
      </button>
    </div>
  );
}
