import React from 'react';

interface LogoProps {
    className?: string;
    type?: 'startup' | 'investor';
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <img 
            src="/logo.png" 
            alt="Startup Connect Logo" 
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
};
