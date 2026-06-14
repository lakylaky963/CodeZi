const iconPaths = {
  arrow:
    'M5 12h14M13 5l7 7-7 7',
  code:
    'M16 18l6-6-6-6M8 6l-6 6 6 6',
  database:
    'M4 7c0 2 4 4 8 4s8-2 8-4-4-4-8-4-8 2-8 4zM4 7v10c0 2 4 4 8 4s8-2 8-4V7M4 12c0 2 4 4 8 4s8-2 8-4',
  game:
    'M7 15h4M9 13v4M15 15h.01M18 13h.01M8 21h8c3.3 0 6-2.7 6-6v-1c0-3.3-2.7-6-6-6h-1l-2-3h-2L9 8H8c-3.3 0-6 2.7-6 6v1c0 3.3 2.7 6 6 6z',
  home:
    'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  layers:
    'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5',
  menu:
    'M4 6h16M4 12h16M4 18h16',
  refresh:
    'M21 12a9 9 0 1 1-2.64-6.36M21 4v6h-6',
  search:
    'M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
  spark:
    'M13 2l1.7 5.3L20 9l-5.3 1.7L13 16l-1.7-5.3L6 9l5.3-1.7L13 2zM5 14l.9 2.7L9 18l-3.1 1.3L5 22l-.9-2.7L1 18l3.1-1.3L5 14z',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
}

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name] || iconPaths.spark} />
    </svg>
  )
}
