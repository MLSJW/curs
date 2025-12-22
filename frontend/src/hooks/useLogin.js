import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import { generateKeyPair, exportPublicKey, exportPrivateKey } from "../utils/crypto";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser, setPrivateKey } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);
		try {
			const res = await apiFetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);

			let privateKeyBase64 = localStorage.getItem("private-key");
			if (!privateKeyBase64) {
				// Generate new key pair only if none exists
				const keyPair = await generateKeyPair();
				privateKeyBase64 = await exportPrivateKey(keyPair.privateKey);
				localStorage.setItem("private-key", privateKeyBase64);

				// Update public key on server
				const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
				await apiFetch("/api/auth/update-public-key", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publicKey: publicKeyBase64 }),
				});
			}
			setPrivateKey(privateKeyBase64);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
