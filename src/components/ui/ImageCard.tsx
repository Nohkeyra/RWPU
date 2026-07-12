import { cn, getAssetUrl } from "@/lib/utils";

interface ImageCardProps {
  src: string;
  alt: string;
  overlayContent?: React.ReactNode;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

export function ImageCard({ 
  src, 
  alt, 
  overlayContent, 
  className,
  aspectRatio = "video" 
}: ImageCardProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]"
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl group", className)}>
      <img 
        src={getAssetUrl(src)} 
        alt={alt} 
        className={cn("w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", aspectClasses[aspectRatio])}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/20 to-transparent" />
      {overlayContent && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {overlayContent}
        </div>
      )}
    </div>
  );
}
