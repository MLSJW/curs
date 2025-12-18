import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import { decryptMessage, importPrivateKey, importAESKey, decryptAES } from "../utils/crypto";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const { privateKey, authUser } = useAuthContext();

	useEffect(() => {
		socket?.on("newMessage", async (newMessage) => {
			let message;
			if (newMessage.senderId === authUser._id) {
				message = newMessage.plainMessage;
			} else if (privateKey) {
				try {
					const privateKeyObj = await importPrivateKey(privateKey);
					const decryptedKey = await decryptMessage(newMessage.encryptedKey, privateKeyObj);
					const aesKey = await importAESKey(decryptedKey);
					const encryptedData = JSON.parse(newMessage.message);
					message = await decryptAES(encryptedData, aesKey);
				} catch (error) {
					console.error("Decrypt error in realtime:", error);
					message = "Error decrypting message";
				}
			}
			newMessage.message = message;
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages, privateKey, authUser]);
};
export default useListenMessages;
