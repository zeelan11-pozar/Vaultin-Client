import { Lock } from "lucide-react"

const ContentPreviewGrid = () => {
  const contentItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center",
      alt: "Digital art content preview",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      alt: "Creator profile content",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1757106228756-72a21823574d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=685",
      alt: "Premium content preview",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=300&fit=crop&crop=center",
      alt: "Tech content preview",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop&crop=center",
      alt: "Exclusive content preview",
    },
    {
      id: 6,
      image: "https://plus.unsplash.com/premium_photo-1760614424094-4625f04d287d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
      alt: "Music content preview",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
      {contentItems.map((item) => (
        <div key={item.id} className="relative group">
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-200">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <Lock className="h-4 w-4 text-neutral-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { ContentPreviewGrid }
