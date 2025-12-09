/**
 * Worldmap Header Component
 * Header for the worldmap view
 */

export interface WorldmapHeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * Worldmap Header component
 */
export function WorldmapHeader({
  title = 'Världskarta',
  subtitle = 'Välj en modul att utforska',
}: WorldmapHeaderProps) {
  return (
    <div
      className="w-full px-6 py-4 border-b-2 flex items-center justify-between flex-shrink-0"
      style={{
        borderColor: '#FFD700',
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h1
        className="text-2xl font-bold pixelated"
        style={{
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(255, 215, 0, 0.5)',
        }}
      >
        {title}
      </h1>
      <div className="text-sm text-gray-400 pixelated">{subtitle}</div>
    </div>
  );
}

