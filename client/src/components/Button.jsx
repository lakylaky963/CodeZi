/**
 * Standardized Tailwind Button
 * Replaces MUI ButtonBase to reduce bundle size and maintain design consistency.
 */
export default function Button({ children, className = '', ...props }) {
  return (
    <button 
      className={`px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all active:scale-95 shadow-sm hover:shadow-md ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
