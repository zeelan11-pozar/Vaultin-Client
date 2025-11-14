import Image from "next/image"
import { Video, Music, FileText, Image as ImageIcon } from "lucide-react"

interface ContentCardProps {
  title: string
  image: string
  timeAgo: string
  type?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'
  onPress?: () => void
}

// Static placeholder images for different content types
const getPlaceholderImage = (type: string) => {
  switch (type) {
    case 'AUDIO':
      return '/audio-placeholder.png'
    case 'DOCUMENT':
      return '/doc-placeholder.png'
    default:
      return '/blurred-sunset-beach-landscape.png'
  }
}

const ContentPreview = ({ type, image, title }: { type: string; image: string; title: string }) => {
  if (type === 'VIDEO') {
    return (
      <div className="relative w-full h-full">
        <Image src={image || getPlaceholderImage(type)} alt={title} fill className="object-cover" />
        {/* Video overlay indicator */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Video className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'AUDIO') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600">
        {/* Audio cover background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-semibold px-2 line-clamp-2">{title}</h3>
          </div>
        </div>
        {/* Animated bars for visual appeal */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-end space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-white/40 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 10 + 4}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'DOCUMENT') {
    return (
      <div className="relative w-full h-full bg-gray-100">
        {/* Document cover background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-700">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-semibold px-2 line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">Document</p>
          </div>
        </div>
      </div>
    );
  }

  // For IMAGE type or default, use the actual image URL
  return (
    <Image src={image || getPlaceholderImage(type || 'IMAGE')} alt={title} fill className="object-cover" />
  );
}

export function ContentCard({ title, image, timeAgo, type = 'IMAGE', onPress }: ContentCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onPress}
      tabIndex={onPress ? 0 : undefined}
      role={onPress ? "button" : undefined}
      onKeyDown={onPress ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPress(); } } : undefined}
    >
      <div className="aspect-video relative">
        <ContentPreview type={type} image={image} title={title} />
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500">{timeAgo}</p>
      </div>
    </div>
  )
}
