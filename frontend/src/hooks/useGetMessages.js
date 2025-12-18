import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { decryptMessage, importPrivateKey } from "../utils/crypto";
import { useAuthContext } from "../context/AuthContext";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { privateKey } = useAuthContext();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation.participant._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				const privateKeyObj = await importPrivateKey(privateKey);
				const decryptedMessages = await Promise.all(data.map(async (msg) => {
					try {
						return { ...msg, message: await decryptMessage(msg.message, privateKeyObj) };
					} catch (error) {
						console.error("Decrypt error:", error);
						return { ...msg, message: "Error decrypting message" };
					}
				}));
				setMessages(decryptedMessages);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?.participant?._id && privateKey) getMessages();
	}, [selectedConversation?.participant?._id, setMessages, privateKey]);

	return { messages, loading };
};
export default useGetMessages;
