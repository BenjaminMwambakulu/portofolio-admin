export default function AboutLayoutPicker({
  selectedLayout,
  setSelectedLayout,
}) {
  const baseStyles =
    "relative aspect-[16/9] w-full rounded-lg border bg-gray-100 p-2 transition hover:border-blue-500 focus:outline-none";

  const selectedStyles = "border-blue-600 ring-2 ring-blue-500";

  return (
    <div className="grid grid-cols-3 gap-4">
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

      {/* Layout 3: Centered Text without Background */}
      <button
        title="Centered Text without Background"
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
    </div>
  );
}

