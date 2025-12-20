import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: function() {
				return this.type === "text";
			},
		},
		type: {
			type: String,
			enum: ["text", "audio", "image"],
			default: "text",
		},
		fileUrl: {
			type: String,
			required: function() {
				return this.type === "audio" || this.type === "image";
			},
		},
		encryptedKey: {
			type: String,
			required: false, // Not required for audio/image (can be unencrypted or use different encryption)
		},
		// AES key encrypted with sender's public key (so sender can decrypt their own messages after reload)
		encryptedKeySender: {
			type: String,
			required: false,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
