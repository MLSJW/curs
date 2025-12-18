import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { generateKeyPair, exportPublicKey, exportPrivateKey } from "../utils/crypto";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser, setPrivateKey } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			// Генерация ключей
			const keyPair = await generateKeyPair();
			const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
			const privateKeyBase64 = await exportPrivateKey(keyPair.privateKey);

			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender, publicKey: publicKeyBase64 }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("chat-user", JSON.stringify(data));
			localStorage.setItem("private-key", privateKeyBase64);
			setAuthUser(data);
			setPrivateKey(privateKeyBase64);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
