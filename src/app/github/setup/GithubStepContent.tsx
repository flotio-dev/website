"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import clientApi, { clientApiRaw } from '@/lib/utils';

export default function GithubSetupContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { token } = useAuth();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Initialisation...");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Performs the POST to link the installation. Exposed so retry can call it.
    const linkGithub = async () => {
        const installationId = searchParams.get("installation_id");

        if (!installationId || isNaN(Number(installationId))) {
            setStatus("error");
            setMessage("Aucun ID d'installation valide trouvé dans l'URL.");
            return;
        }

        setIsSubmitting(true);
        setStatus("loading");
        setMessage("Connexion à GitHub...");

        try {
            const res = await clientApiRaw("github/post-installation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ installation_id: Number(installationId) }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                // Attempt to pull message from server response
                const serverMessage = data && (data.message || data.error || data.error_description);
                setStatus("error");
                setMessage(serverMessage || `API request failed with status ${res.status}`);
                return;
            }

            setStatus("success");
            // If server returned a message (e.g., "Installation GitHub mise à jour"), show it.
            const okMessage = data && (data.message || data.msg || data.result) ? (data.message || data.msg || data.result) : "Installation réussie ! Votre compte GitHub est maintenant lié à Flotio";
            setMessage(okMessage);
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err: any) {
            setStatus("error");
            const errorMessage = err instanceof Error ? err.message : "Impossible de contacter le serveur. Réessayez plus tard.";
            setMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (token) {
            linkGithub();
        }
        // we intentionally omit linkGithub from deps to avoid recreating the function
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, router, token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10"
            >
                <div className="flex flex-col items-center">
                    {status === "loading" && (
                        <>
                            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h1 className="text-2xl font-semibold">Connexion à GitHub...</h1>
                            <p className="mt-2 text-white/80">{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="text-6xl mb-4">✅</div>
                            <h1 className="text-3xl font-bold mb-2">Installation réussie</h1>
                            <p className="text-white/80">{message}</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="text-6xl mb-4">❌</div>
                            <h1 className="text-3xl font-bold mb-2">Erreur</h1>
                            <p className="text-white/80 max-w-lg">{message}</p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-5 py-2 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition"
                                >
                                    Retour à l’accueil
                                </button>

                                <button
                                    onClick={linkGithub}
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-60 transition"
                                >
                                    {isSubmitting ? 'Réessai en cours...' : 'Réessayer'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
