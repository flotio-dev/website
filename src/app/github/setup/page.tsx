"use client";

import { Suspense } from "react";
import GithubSetupContent from "../setup/GithubStepContent";

export default function GithubSetupPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <GithubSetupContent />
        </Suspense>
    );
}
