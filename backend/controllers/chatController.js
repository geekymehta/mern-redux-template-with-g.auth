const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const AppError = require("../model/errorModel");
const Mongoose = require("mongoose");

const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user.id });
  if (!chats) {
    res.status(404).json({ message: "No chats found" });
  }
  res.status(200).json(chats);
});

const createChat = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { user } = req;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: "name is a required fields." });
  }
  if (!user) {
    return res.status(400).json({ error: "user is a required" });
  }
  console.log("user : " + user);
  console.log(user.id);
  // Create a new chat
  const newChat = new Chat({
    name,
    user: user._id,
  });

  let savedChat; // <-- define savedChat here

  try {
    const sess = await Mongoose.startSession();
    sess.startTransaction();
    savedChat = await newChat.save({ session: sess }); // <-- assign a value to savedChat here
    console.log(user);
    user.chats.push(savedChat);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    throw new AppError("Creating place failed, please try again.", 500);
  }
  console.log("still executed");
  // if (!savedChat) {
  //   res.status(500);
  //   throw new AppError("Error creating chat", 500);
  // }

  res
    .status(201)
    .json({ message: "Chat created successfully", chat: savedChat });
});

const getConvoByChatId = asyncHandler(async (req, res) => {
  const { user } = req;
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ error: "chatId is required" });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  if (chat.user.toString() !== user.id) {
    res.status(401);
    throw new AppError("Not authorized to access this chat", 401);
  }

  const { conversations } = chat;
  res.status(200).json(conversations);
});

const addConvoByChatId = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { sender, content } = req.body;
  const { user } = req;

  if (!chatId || !sender || !content) {
    return res
      .status(400)
      .json({ error: "chatId, sender and content are required" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404).json({ error: "Chat not found" });
  }

  if (!chat.user.equals(user.id)) {
    res.status(401);
    throw new AppError("Not authorized to access this chat", 401);
  }
  chat.conversations.push({ sender, content });
  const savedChat = await chat.save();

  res
    .status(201)
    .json({ message: "Conversation added successfully", chat: savedChat });
});

const updateChatByChatId = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { name } = req.body;
  const { user } = req;

  if (!chatId || !name) {
    res.status(400);
    throw new AppError("chatId and name are required", 400);
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new AppError("Chat not found", 404);
  }
  if (!chat.user.equals(user.id)) {
    res.status(401);
    throw new AppError("Not authorized to access this chat", 401);
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { name },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Chat updated successfully", updated_chat: updatedChat });
});

const deleteChatByChatId = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { user } = req;

  const chat = await Chat.findByIdAndDelete(chatId);
  if (!chat) {
    res.status(404);
    throw new AppError("Chat not found", 404);
  }
  if (!chat.user.equals(user.id)) {
    res.status(401);
    throw new AppError("Not authorized to access this chat", 401);
  }

  await Chat.findByIdAndDelete(chatId);

  res
    .status(200)
    .json({ message: "Chat deleted successfully", deleted_chat: deletedChat });
});

module.exports = {
  getChats,
  createChat,
  getConvoByChatId,
  addConvoByChatId,
  updateChatByChatId,
  deleteChatByChatId,
};
