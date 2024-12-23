import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b p-4">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-16 w-[300px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <Skeleton className="h-[60px] w-full rounded-lg" />
      </div>
    </div>
  );
}
