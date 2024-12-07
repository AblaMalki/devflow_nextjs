// Server Component
import React, { Suspense } from "react";
import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// Metadata for the page
export const metadata: Metadata = {
  title: "AskQuestion | Devflow",
};

// Client Component to handle client-side logic
const AskQuestionClient = ({ mongoUserId }: { mongoUserId: string }) => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question mongoUserId={mongoUserId} />
      </div>
    </div>
  );
};

// Server Component for data fetching and rendering
const PageContent = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass props to the client component */}
      <AskQuestionClient mongoUserId={JSON.stringify(mongoUser?._id)} />
    </Suspense>
  );
};

// Main Page Component
export default function Page() {
  return <PageContent />;
}
