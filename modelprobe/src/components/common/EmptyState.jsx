import './EmptyState.css';

/**
 * EmptyState — Centered placeholder for empty data views
 */
export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div
        className="empty-state-title"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {description && (
        <div className="empty-state-description">{description}</div>
      )}
    </div>
  );
}
