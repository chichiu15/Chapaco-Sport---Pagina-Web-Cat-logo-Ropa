
function IconoWhatsapp({ size = 24, strokeWidth = 2, className = '', ...resto }) {
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
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8.9 19.3L3 21Z" />
      <path d="M9 10.5c0 3 2.5 5.5 5.5 5.5.5 0 1-.35 1.15-.85l.3-1a.75.75 0 0 0-.4-.9l-1.6-.75a.75.75 0 0 0-.85.15l-.4.4a4.7 4.7 0 0 1-2.25-2.25l.4-.4a.75.75 0 0 0 .15-.85l-.75-1.6a.75.75 0 0 0-.9-.4l-1 .3c-.5.15-.85.65-.85 1.15Z" />
    </svg>
  );
}
 
export default IconoWhatsapp;
 