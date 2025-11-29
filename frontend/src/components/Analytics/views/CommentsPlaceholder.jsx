import React from "react";

const CommentsPlaceholder = () => {
  return (
    <div
      style={{
        padding: "2rem",
        border: "1px dashed var(--border-color, #d1d5db)",
        borderRadius: "12px",
        textAlign: "center",
        color: "var(--text-muted, #6b7280)",
        background: "var(--surface, #ffffff)",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>Comentarios del evento</h3>
      <p>Aquí podrían estar los comentarios de las y los asistentes.</p>
    </div>
  );
};

export default CommentsPlaceholder;
