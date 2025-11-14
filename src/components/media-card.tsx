import Image from "next/image"
import { Eye, Heart, DollarSign, Image as ImageIcon, Video, Music, FileText } from "lucide-react"
import { PostMediaResponse } from "@/types"
import { format } from "date-fns"

interface MediaCardProps extends PostMediaResponse {
  onPress?: () => void
}

const typeIcons = {
  IMAGE: <ImageIcon className="w-5 h-5" />,
  VIDEO: <Video className="w-5 h-5" />,
  AUDIO: <Music className="w-5 h-5" />,
  DOCUMENT: <FileText className="w-5 h-5" />,
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

const MediaPreview = ({ type, url, title }: { type: string; url: string; title: string }) => {
  if (type === 'VIDEO') {
    return (
      <div className="relative w-full h-full bg-black">
        <video
          src={url}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
          poster={url} // This will show the first frame
          onLoadedData={(e) => {
            // Seek to first frame to ensure it's displayed
            const video = e.target as HTMLVideoElement;
            video.currentTime = 0;
          }}
        />
        {/* Video overlay indicator */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Video className="w-6 h-6 text-white ml-1" />
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
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Music className="w-8 h-8" />
            </div>
            {/* <h3 className="text-sm font-semibold px-2 line-clamp-2">{title}</h3> */}
          </div>
        </div>
        {/* Animated bars for visual appeal */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-end space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-white/40 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 12 + 6}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div> */}
      </div>
    );
  }

  if (type === 'DOCUMENT') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600">
        {/* Document cover background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-700">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8" />
            </div>
            {/* <h3 className="text-sm font-semibold px-2 line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">Document</p> */}
          </div>
        </div>
      </div>
    );
  }

  // For IMAGE type, use the actual image URL
  return (
    <Image
      src={url || getPlaceholderImage(type)}
      alt={title}
      fill
      className="object-cover"
    />
  );
}

export function MediaCard(props: MediaCardProps) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={props.onPress}
      tabIndex={props.onPress ? 0 : undefined}
      role={props.onPress ? "button" : undefined}
      onKeyDown={props.onPress ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onPress?.(); } } : undefined}>
      <div className="relative aspect-video">
        <MediaPreview type={props.type} url={props.url} title={props.title} />
      </div>

      <div className="p-3 md:p-4">
        <div className="flex items-center space-x-2 mb-2">
          {(() => {
            // Map status to color and label
            const statusMap: Record<string, { color: string; label: string }> = {
              APPROVED: { color: "green-500", label: "Approved" },
              PENDING_REVIEW: { color: "yellow-500", label: "Pending" },
              REJECTED: { color: "red-500", label: "Rejected" },
              SUSPENDED: { color: "gray-500", label: "Suspended" },
              DELETED: { color: "gray-400", label: "Deleted" },
            };
            const status = statusMap[props.status as string] || { color: "gray-400", label: props.status || "Unknown" };
            return (
              <div className="flex items-center space-x-1 mr-2">
                <div className={`w-2 h-2 rounded-full bg-${status.color}`} />
                <span className={`text-xs font-medium text-${status.color}`}>{status.label}</span>
              </div>
            );
          })()}
          {/* <span className="text-xs text-gray-500">{props.type}</span> */}
          <span className="text-xs text-gray-400 ml-auto">{format(new Date(props.createdAt), "MMM d, yyyy")}</span>
        </div>

        <div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-gray-200 rounded-lg p-2 text-black">
              {typeIcons[props.type as keyof typeof typeIcons]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-3 text-sm md:text-base truncate">{props.title}</h3>
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                <div className="flex items-center space-x-3 md:space-x-4">
                  {/* <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{0}</span>
                  </div> */}
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 font-medium text-green-600">
                  <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                  <span>${props.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
