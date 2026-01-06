'use client';

import React from 'react';

const AdSense = ({ slot }: { slot: string }) => {
    return (
        <div className="glass" style={{
            width: '100%',
            height: '100px',
            margin: '2rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            borderStyle: 'dashed'
        }}>
            Espaço Publicitário (AdSense Slot: {slot})
        </div>
    );
};

export default AdSense;
