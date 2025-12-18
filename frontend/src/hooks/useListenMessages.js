import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import { decryptMessage, importPrivateKey } from "../utils/crypto";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const { privateKey } = useAuthContext();

	useEffect(() => {
		socket?.on("newMessage", async (newMessage) => {
			if (privateKey) {
				const privateKeyObj = await importPrivateKey(privateKey);
				newMessage.message = await decryptMessage(newMessage.message, privateKeyObj);
			}
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages, privateKey]);
};
export default useListenMessages;
