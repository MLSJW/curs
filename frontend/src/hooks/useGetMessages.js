import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { decryptMessage } from "../utils/encrypt";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation.participant._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				const decryptedMessages = data.map(msg => ({
					...msg,
					message: decryptMessage(msg.message)
				}));
				setMessages(decryptedMessages);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?.participant?._id) getMessages();
	}, [selectedConversation?.participant?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
