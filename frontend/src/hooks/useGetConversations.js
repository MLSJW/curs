import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const { socket } = useSocketContext();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/messages/conversations", {
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				if (!Array.isArray(data)) throw new Error("Invalid conversations payload (expected array)");
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	useEffect(() => {
		if (!socket) return;

		const onNewConversation = (conversation) => {
			setConversations((prev) => {
				// avoid duplicates
				if (prev.some((c) => c._id === conversation._id)) return prev;
				return [conversation, ...prev];
			});
		};

		const onConversationDeleted = ({ conversationId }) => {
			setConversations((prev) => prev.filter((c) => c._id !== conversationId));
		};

		const onMessagesRead = ({ conversationId, userId }) => {
			// If someone read messages in a conversation, set unreadCount to 0 for that conversation
			setConversations((prev) => prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c)));
		};

		socket.on("newConversation", onNewConversation);
		socket.on("conversationDeleted", onConversationDeleted);
		socket.on("messagesRead", onMessagesRead);
		return () => {
			socket.off("newConversation", onNewConversation);
			socket.off("conversationDeleted", onConversationDeleted);
			socket.off("messagesRead", onMessagesRead);
		};
	}, [socket]);

	return { loading, conversations, setConversations };
};
export default useGetConversations;
