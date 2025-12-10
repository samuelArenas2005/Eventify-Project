import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ score = 0, max = 5, size = 16, onRate = null, readOnly = true }) => {
    // Array de 1 a 5
    const stars = Array.from({ length: max }, (_, i) => i + 1);

    return (
        <div style={{ display: "flex", gap: "4px" }}>
            {stars.map((starValue) => {
                const isFilled = starValue <= score;
                return (
                    <Star
                        key={starValue}
                        size={size}
                        onClick={() => !readOnly && onRate && onRate(starValue)}
                        fill={isFilled ? "#FFD700" : "none"} // Amarillo oro si está lleno
                        color={isFilled ? "#FFD700" : "#9CA3AF"} // Borde amarillo o gris
                        style={{ cursor: readOnly ? "default" : "pointer" }}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;