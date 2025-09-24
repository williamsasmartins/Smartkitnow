interface AdSenseProps {
  slot: string;
  size: 'top-banner' | 'side-banner' | 'center-banner' | 'bottom-banner';
  className?: string;
}

export function AdSense({ slot, size, className = "" }: AdSenseProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'top-banner':
        return 'w-full h-[90px] max-w-[728px] mx-auto';
      case 'side-banner':
        return 'w-[300px] h-[600px]';
      case 'center-banner':
        return 'w-full h-[90px] max-w-[728px] mx-auto';
      case 'bottom-banner':
        return 'w-full h-[50px] sm:h-[90px] max-w-[728px] mx-auto';
      default:
        return 'w-full h-[90px]';
    }
  };

  return (
    <div 
      id={slot}
      className={`bg-muted/20 border border-border/30 rounded-lg flex items-center justify-center ${getSizeClasses()} ${className}`}
    >
      <div className="text-center text-muted-foreground text-xs p-2">
        <div className="font-medium mb-1">Ad Space</div>
        <div>{size.replace('-', ' ').toUpperCase()}</div>
        <div className="text-[10px] mt-1">(Google AdSense)</div>
      </div>
    </div>
  );
}