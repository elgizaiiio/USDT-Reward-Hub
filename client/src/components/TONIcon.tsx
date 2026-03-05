export function TONIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle fill="#0098EA" cx="100" cy="100" r="100"/>
      <path fill="#FFF" d="M99.98 141.52l-51.5-69.64h103l-51.5 69.64zm0-95.04L40.73 66.86 99.98 12.3l59.25 54.56-59.25-20.38z"/>
    </svg>
  );
}
