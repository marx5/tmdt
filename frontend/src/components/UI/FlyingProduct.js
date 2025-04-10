import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import './FlyingProduct.scss';

const FlyingProduct = ({ image, startPosition, endPosition, onComplete }) => {
    const [position, setPosition] = useState(startPosition);
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Calculate new position with a curve
            const curve = progress * (2 - progress); // Ease-out curve
            const newX = startPosition.x + (endPosition.x - startPosition.x) * curve;
            const newY = startPosition.y + (endPosition.y - startPosition.y) * curve;

            // Calculate scale and opacity
            const newScale = 1 - progress * 0.5; // Scale down to 0.5
            const newOpacity = 1 - progress; // Fade out

            setPosition({ x: newX, y: newY });
            setScale(newScale);
            setOpacity(newOpacity);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestAnimationFrame(animate);
    }, [startPosition, endPosition, onComplete]);

    return (
        <div
            className="flying-product"
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `scale(${scale})`,
                opacity: opacity,
                zIndex: 1000,
                pointerEvents: 'none',
                transition: 'all 0.3s ease-out',
            }}
        >
            <Image src={image} rounded style={{ width: '50px', height: '50px' }} />
        </div>
    );
};

export default FlyingProduct; 