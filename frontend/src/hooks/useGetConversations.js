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

		socket.on("newConversation", onNewConversation);
		return () => socket.off("newConversation", onNewConversation);
	}, [socket]);

	return { loading, conversations };
};
export default useGetConversations;
