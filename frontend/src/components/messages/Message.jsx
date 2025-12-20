import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	if (!authUser || !message) return null;
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.participant?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	const renderMessageContent = () => {
		const msgType = message.type || "text";
		
		if (msgType === "image" && message.fileUrl) {
			return (
				<img
					src={message.fileUrl}
					alt="Sent image"
					className="max-w-xs rounded-lg cursor-pointer"
					onClick={() => window.open(message.fileUrl, "_blank")}
					onError={(e) => {
						console.error("Image load error:", message.fileUrl);
						e.target.style.display = "none";
					}}
				/>
			);
		}

		if (msgType === "audio" && message.fileUrl) {
			console.log("Rendering audio message:", { type: msgType, fileUrl: message.fileUrl });
			return (
				<div>
					<audio 
						controls 
						className="w-full max-w-xs"
						onError={(e) => {
							console.error("Audio load error:", message.fileUrl, e);
						}}
						onLoadStart={() => {
							console.log("Audio loading:", message.fileUrl);
						}}
					>
						<source src={message.fileUrl} type="audio/webm" />
						<source src={message.fileUrl} type="audio/ogg" />
						<source src={message.fileUrl} type="audio/mpeg" />
						<source src={message.fileUrl} type="audio/wav" />
						Ваш браузер не поддерживает аудио элемент.
					</audio>
					{/* Debug info - удалить после проверки */}
					<div className="text-xs text-gray-400 mt-1">URL: {message.fileUrl}</div>
				</div>
			);
		}

		// Текстовое сообщение (default или type === "text")
		return <div>{message.message || ""}</div>;
	};

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 ${(message.type === "image" || message.type === "audio") ? "bg-transparent p-0" : ""}`}>
				{renderMessageContent()}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
