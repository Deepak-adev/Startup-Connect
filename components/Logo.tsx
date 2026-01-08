import React from 'react';

interface LogoProps {
    className?: string;
    type?: 'startup' | 'investor';
}

export const Logo: React.FC<LogoProps> = ({ className, type = 'startup' }) => {
    const isInvestor = type === 'investor';

    // Professional Geometric "SC" Monogram for Startup Connect
    // Interlocking shapes representing connection
    if (!isInvestor) {
        return (
            <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <rect width="40" height="40" rx="10" fill="url(#mainGradient)" />
                <path
                    d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20V22C28 24.2091 26.2091 26 24 26H20"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="opacity-90"
                />
                <path
                    d="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20V18C12 15.7909 13.7909 14 16 14H20"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                />
                <circle cx="20" cy="20" r="2" fill="white" />
                <defs>
                    <linearGradient id="mainGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F46E5" /> {/* Indigo-600 */}
                        <stop offset="1" stopColor="#1E293B" /> {/* Slate-800 */}
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    // Abstract "I" / Graph for Investor Hub
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="40" height="40" rx="10" fill="url(#investorGradient)" />
            <path d="M20 12V28" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M14 18L20 12L26 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 28H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />
            <defs>
                <linearGradient id="investorGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" /> {/* Emerald-500 */}
                    <stop offset="1" stopColor="#0F766E" /> {/* Teal-700 */}
                </linearGradient>
            </defs>
        </svg>
    );
};
