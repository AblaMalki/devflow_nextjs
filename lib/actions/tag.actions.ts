
"use server"

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types.d';
import Tag from '@/database/tag.model';


export async function getTopInteractedTags(params: GetTopInteractedTagsParams){
try {
    connectToDatabase();
    // const { userId , limit =3 } = params;

    const { userId  } = params;
    const user= await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }

    // Find all interactions of the user

    // const tags = await Interaction.aggregate([
    //     { $match: { user: userId } },
    //     { $group: { _id: "$tag", count: { $sum: 1 } } },
    //     { $sort: { count: -1 } },
    //     { $limit: 5 },
    //     { $lookup: { from: "tags", localField: "_id", foreignField: "_id", as: "tag" } },
    //     { $unwind: "$tag" },
    //     { $project: { _id: "$tag._id", name: "$tag.name" } }
    // ])

    return [{_id:'1', name:'tag1'}, {_id:'2', name:'tag2'}, {_id:'3', name:'tag3'}];

}catch(error){
    console.log(error);
    throw error;
}
}

export  async function getAllTags(params:GetAllTagsParams){
    try {
        connectToDatabase();
        const tags = await Tag.find({});
        return{ tags};
    } catch (error) {
        console.log(error);
        throw error;
    }
}