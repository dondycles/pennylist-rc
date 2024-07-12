import { Skeleton } from "./ui/skeleton";
export default function SkeletonLoading() {
  return (
    <main className="w-full h-full">
      <div className=" max-w-[800px] mx-auto px-2 flex flex-col justify-start gap-2 mb-[5.5rem]">
        <Skeleton className="w-full h-24  mt-2" />
        <Skeleton className="w-full h-10 " />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </main>
  );
}
