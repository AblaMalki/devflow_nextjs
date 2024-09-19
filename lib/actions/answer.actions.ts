"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
// import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";


export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    // Create the answer
    const newAnswer  = await Answer.create({
      content,
      author,
      question,
    });
    
     // Add the answer to the question's answers array
    //  const questionObject = 
    
     await Question.findByIdAndUpdate(question, {
        $push: { answers: newAnswer._id}
      })

    // Create an interaction record for the user's answer_question action
    // await Interaction.create({
    //   user: author,
    //   action: "answer_question",
    //   answer: answer._id,
    //   question,
    // })

    // Increment author's reputation by +10 for creating an answer
    // await User.findByIdAndUpdate(author, { $inc: { reputation: 10 }})

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// 

export async function getAnswers(params: GetAnswersParams) {
    try {
      connectToDatabase();
  
      const { questionId, sortBy, page = 1, pageSize = 10 } = params;
  
      const skipAmount = (page - 1) * pageSize;
  
      let sortOptions = {};
  
      switch (sortBy) {
        case "highestUpvotes":
          sortOptions = { upvotes: -1 }
          break;
        case "lowestUpvotes":
          sortOptions = { upvotes: 1 }
          break;
        case "recent":
          sortOptions = { createdAt: -1 }
          break;
        case "old":
          sortOptions = { createdAt: 1 }
          break;
      
        default:
          break;
      }
  
      const answers = await Answer.find({ question: questionId })
        .populate("author", "_id clerkId name picture")
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
  
      const totalAnswer = await Answer.countDocuments({ 
        question: questionId
      })
  
      const isNextAnswer = totalAnswer > skipAmount + answers.length;
  
      return { answers, isNextAnswer };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

