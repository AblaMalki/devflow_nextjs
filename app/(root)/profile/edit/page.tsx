import React, { Suspense } from "react";
import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const PageContent = async ({ params }: { params: { id: string } }) => {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId: params.id });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </div>
  );
};

// @ts-ignore
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent params={resolvedParams} />
    </Suspense>
  );
}
