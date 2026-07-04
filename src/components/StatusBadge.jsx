function StatusBadge({ status }) {
  const messages = {
    checking: 'Connecting to library systems…',
    connected: 'Connected and ready',
    offline: 'Connection unavailable',
  };

  return (
    <div className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      <span>{messages[status]}</span>
    </div>
  );
}

export default StatusBadge;