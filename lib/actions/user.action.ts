"use server"
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, {IQuestion} from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";


// getUserById function to get user by id from the database
export async function getUserById(params :any) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });
        
        return user;
    }catch(error) {
        console.log(error);
        throw error;
    }

}

// createUser function to create a new user in the database
export async function createUser(userData: CreateUserParams) {
    try {
      connectToDatabase();
  
      const newUser = await User.create(userData);
  
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

// updateUser function to update user in the database
export async function updateUser(params: UpdateUserParams) {
    try {
      connectToDatabase();
  
      const { clerkId, updateData, path } = params;
  
      await User.findOneAndUpdate({ clerkId }, updateData, {
        new: true,
      });
  
      revalidatePath(path);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

// deleteUser function to delete user from the database
export async function deleteUser(params: DeleteUserParams) {
    try {
      connectToDatabase();
  
      const { clerkId } = params;
  
      const user = await User.findOneAndDelete({ clerkId });
  
      if(!user) {
        throw new Error('User not found');
      }
  
      // Delete user from database
      // and questions, answers, comments, etc.
  
      // get user question ids (we need it to delete the answers, comments, etc.)
      // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');
  
      // delete user questions
      await Question.deleteMany({ author: user._id });
  
      // TODO: delete user answers, comments, etc.
  
      const deletedUser = await User.findByIdAndDelete(user._id);
  
      return deletedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

export async function getAllUsers(params:GetAllUsersParams) {
    try {
      connectToDatabase();
  
      // const {page =1, pageSize=20, filter, searchQuery} = params;

      const users = await User.find({}).sort({createdAt: -1});
  
      return{ users};
    } catch (error) {
      console.log(error);
      throw error;  
    }
}

// toggleSaveQuestion function to toggle save question
export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if(!user) {
      throw new Error('User not found');
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if(isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(userId, 
        { $pull: { saved: questionId }},
        { new: true }
      )
    } else {
      // add question to saved
      await User.findByIdAndUpdate(userId, 
        { $addToSet: { saved: questionId }},
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// getSavedQuestions function to get saved questions the Collection page
export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    // const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;
    const { clerkId, searchQuery } = params;

    // const skipAmount = (page - 1) * pageSize;

    // const query: FilterQuery<typeof IQuestion> = searchQuery
    
    const query: FilterQuery<IQuestion> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } as any}
      : { };

      // let sortOptions = {};

      // switch (filter) {
      //   case "most_recent":
      //     sortOptions = { createdAt: -1 }
      //     break;
      //   case "oldest":
      //     sortOptions = { createdAt: 1 }
      //     break;
      //   case "most_voted":
      //     sortOptions = { upvotes: -1 }
      //     break;
      //   case "most_viewed":
      //     sortOptions = { views: -1 }
      //     break;
      //   case "most_answered":
      //     sortOptions = { answers: -1 }
      //     break;
      
      //   default:
      //     break;
      // }

    const user = await User
    .findOne({ clerkId })
    .populate({
      path: 'saved',
      match: query,
      options: {
        sort:{ createdAt: -1 },
        // sort: sortOptions,
        // skip: skipAmount,
        // limit: pageSize + 1,
      },
      populate: [
        { path: 'tags', model: Tag, select: "_id name" },
        { path: 'author', model: User, select: '_id clerkId name picture'}
      ]
    })

    // const isNext = user.saved.length > pageSize;
    
    if(!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    // return { questions: savedQuestions, isNext };
    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
