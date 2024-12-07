import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const EditQuestionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) return null;

  // Ensure params is awaited
  const resolvedParams = await params;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: resolvedParams.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={mongoUser._id}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default EditQuestionPage;
