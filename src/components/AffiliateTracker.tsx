'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Tracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            localStorage.setItem('dropmasters_ref', ref);
            console.log("Affiliate Neural Link Detected:", ref);
        }
    }, [searchParams]);

    return null;
}

export default function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <Tracker />
        </Suspense>
    );
}
