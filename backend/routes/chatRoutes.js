const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getChats,
  createChat,
  getConvoByChatId,
  addConvoByChatId,
  updateChatByChatId,
  deleteChatByChatId,
} = require("../controllers/chatController");

router.route("/").get(protect, getChats).post(protect, createChat);

router
  .route("/:chatId")
  .get(protect, getConvoByChatId)
  .post(protect, addConvoByChatId)
  .put(protect, updateChatByChatId)
  .delete(protect, deleteChatByChatId);

module.exports = router;
