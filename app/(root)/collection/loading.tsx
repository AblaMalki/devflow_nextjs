import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mb-12 mt-11 flex flex-wrap gap-5">
        <Skeleton className="background-light800_dark300 h-14 flex-1" />
        <Skeleton className="background-light800_dark300 h-14 w-28" />
      </div>

      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="background-light800_dark300 h-48 w-full rounded-xl"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
