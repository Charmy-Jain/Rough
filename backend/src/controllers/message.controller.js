import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";
import Conversation from "../models/conversation.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loginUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loginUserId}}).select("-password");
        
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({ //this will find all the messages between the two users
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        console.log("User sending message:", req.user);  // Debugging line
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;  // Check if req.user exists

        if (!senderId) {
            return res.status(401).json({ error: "Unauthorized - No sender ID found" });
        }

        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiverId],
            });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({
            message: "Message sent successfully",
            newMessage
        });

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
