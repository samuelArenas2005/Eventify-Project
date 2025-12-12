import React from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';
// Asumo que usas el mismo archivo de estilos que el padre, o puedes crear uno propio.
// Aquí usaremos estilos en línea combinados con clases globales o pasaremos clases del módulo padre.
// Para mantenerlo simple y coherente con tu proyecto, usaré clases que definiremos en EventAnalytics.module.css

const CommentsListView = ({ comments, loading, styles }) => {

    // Calcular promedio
    const averageRating = comments.length > 0
        ? (comments.reduce((acc, curr) => acc + curr.score, 0) / comments.length).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Cargando opiniones...</p>
            </div>
        );
    }

    return (
        <div className={styles.commentsViewContainer}>
            {/* Cabecera de Estadísticas de Comentarios */}
            <div className={styles.commentsHeaderCard}>
                <div className={styles.ratingSummary}>
                    <h2 className={styles.sectionTitle}>
                        <MessageCircle className={styles.iconTitle} size={24} />
                        Opiniones del Evento
                    </h2>
                    <div className={styles.bigRating}>
                        <span className={styles.bigScore}>{averageRating}</span>
                        <div className={styles.starsWrapper}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill={i < Math.round(averageRating) ? "#FFD700" : "none"}
                                    color={i < Math.round(averageRating) ? "#FFD700" : "#ccc"}
                                />
                            ))}
                        </div>
                        <span className={styles.totalReviews}>({comments.length} reseñas)</span>
                    </div>
                </div>
            </div>

            {/* Lista de Comentarios */}
            <div className={styles.commentsGrid}>
                {comments.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aún no hay comentarios para este evento.</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.commentDashboardCard}>
                            <div className={styles.commentCardHeader}>
                                <div className={styles.commentUserInfo}>
                                    <div className={styles.userAvatarSmall}>
                                        <User size={16} />
                                    </div>
                                    <div className={styles.commentMeta}>
                                        <span className={styles.commentUserName}>
                                            {comment.username || "Usuario Anónimo"}
                                        </span>
                                        <span className={styles.commentDate}>
                                            <Calendar size={12} style={{ marginRight: 4 }} />
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.commentStars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < comment.score ? "#FFD700" : "none"}
                                            color={i < comment.score ? "#FFD700" : "#ddd"}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.commentBody}>
                                <p>
                                    {comment.comment
                                        ? comment.comment
                                        : <span style={{ fontStyle: 'italic', color: '#999' }}>Sin comentario escrito.</span>
                                    }
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsListView;