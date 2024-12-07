import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();

  if (!userId) return null;

  // Ensure params is awaited
  const resolvedParams = await params;

  const mongoUser = await getUserById({ userId: resolvedParams.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
