import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { encryptMessage, importPublicKey } from "../utils/crypto";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			// Импорт публичного ключа получателя
			const publicKey = await importPublicKey(selectedConversation.participant.publicKey);
			const encryptedMessage = await encryptMessage(message, publicKey);

			const res = await fetch(`/api/messages/send/${selectedConversation.participant._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: encryptedMessage }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, { ...data, message }]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
