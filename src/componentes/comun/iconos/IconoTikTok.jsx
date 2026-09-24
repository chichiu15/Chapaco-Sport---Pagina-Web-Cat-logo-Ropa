
function IconoTikTok({ size = 24, strokeWidth = 2, className = '', ...resto }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...resto}
    >
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M15 3a5 5 0 0 0 5 5" />
      <path d="M20 8v3a8 8 0 0 1-5-1.75" />
    </svg>
  );
}

export default IconoTikTok;