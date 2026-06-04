"use client"

interface YoutubeEmbedProps {
  videoId: string
  title?:  string
}

export function YoutubeEmbed({ videoId, title = "Builder Session" }: YoutubeEmbedProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/20">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        title={title}
      />
    </div>
  )
}
