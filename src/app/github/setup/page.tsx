"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from '@/lib/hooks/useAuth';


export default function GithubSetupPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { token } = useAuth();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Initialisation...");

    useEffect(() => {
        console.log(token)

        const installationId = searchParams.get("installation_id");

        if (!installationId || isNaN(Number(installationId))) {
            setStatus("error");
            setMessage("Aucun ID d'installation valide trouvé dans l'URL.");
            return;
        }

        const linkGithub = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/github/post-installation`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ installation_id: Number(installationId) }),
                    }
                );

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    setStatus("error");
                    setMessage(err.message || "Erreur lors de la liaison de votre compte GitHub.");
                    return;
                }

                setStatus("success");
                setMessage("Installation réussie ! Votre compte GitHub est maintenant lié à Flotio 🎉");
                setTimeout(() => router.push("/dashboard"), 2000);
            } catch (err) {
                setStatus("error");
                setMessage("Impossible de contacter le serveur. Réessayez plus tard.");
            }
        };

        if (token) {
            linkGithub();
        }
    }, [searchParams, router, token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center px-4">
            {status === "loading" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h1 className="text-2xl font-semibold">Connexion à GitHub...</h1>
                    <p className="mt-2 text-white/80">{message}</p>
                </motion.div>
            )}

            {status === "success" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold mb-2">Installation réussie</h1>
                    <p className="text-white/80">{message}</p>
                </motion.div>
            )}

            {status === "error" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-3xl font-bold mb-2">Erreur</h1>
                    <p className="text-white/80">{message}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 px-6 py-2 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition"
                    >
                        Retour à l’accueil
                    </button>
                </motion.div>
            )}
        </div>
    );
}
