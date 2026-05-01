import Card from "@/components/UI/Card";

export default function InboxSkeleton() {
  return (
    <Card
      className="sticky top-10 space-y-6 h-167.5 overflow-hidden" 
      variant="flat" 
      padding="md"
    >
      {/* Header Skeleton */}
      <div className="space-y-3">
        {/* Título "Mensajes" */}
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded-md" />
        
        {/* SearchBar Skeleton */}
        <div className="h-10 w-full bg-gray-100 animate-pulse rounded-xl border border-gray-100" />
      </div>

      {/* Contacts List Skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full shrink-0" />
            
            {/* Info del contacto */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-full bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}