export function LeftNavigation(props) {
  const { children, hidden } = props;
  return (
    <div
      className={`flex flex-col ${
        hidden ? `w-0` : `w-1/16`
      } transition-all h-full items-center 
      shadow-lg pt-4 space-y-5 relative duration-300`}
    >
      {!hidden && children}
    </div>
  );
}

export function NavigationItem(props) {
  const { children, title, onClick, isFirst, isActive } = props;

  return (
    <button
      className={`group relative w-12 h-12 rounded-xl flex flex-col items-center justify-center
        transition-all duration-200 hover:w-14 mx-2 text-on-surface text-xl
        ${isFirst ? "mt-4" : "mt-0"}
      `}
      onClick={() => {
        onClick?.();
      }}
    >
      {/* 图标容器 */}
      <div
        className={`transform transition-all ${
          isActive ? "scale-125 -translate-y-1" : "group-hover:scale-110"
        }`}
      >
        {children}
      </div>

      {/* 浮动标签 */}
      <div
        className={`absolute left-full ml-3 px-3 z-10 py-1.5 rounded-md shadow-md
        text-sm font-medium bg-surface
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none whitespace-nowrap`}
      >
        {title}
      </div>

      {/* 激活指示器 */}
      {isActive && (
        <div
          className="absolute -left-1 top-1/2 w-1 h-6 bg-primary
          rounded-full -translate-y-1/2"
        />
      )}
    </button>
  );
}
