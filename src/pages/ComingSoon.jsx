import { useEffect, useState } from 'react';
import { checkBackendStatus } from '../services/api';
import StatusBadge from '../components/StatusBadge';

function ComingSoon() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkBackendStatus().then((result) => {
      setStatus(result.connected ? 'connected' : 'offline');
    });
  }, []);

  return (
    <main className="coming-soon">
      <div className="coming-soon__wrapper">
        <div className="coming-soon__accent" />
        
        <span className="coming-soon__label">BooksStore</span>

        <h1 className="coming-soon__title">
          Building your library.
        </h1>

        <p className="coming-soon__subtitle">
          A space to discover, read, and keep real books. Something good 
          deserves care. Thank you for your patience.
        </p>

        <footer className="coming-soon__footer">
          <StatusBadge status={status} />
        </footer>
      </div>
    </main>
  );
}

export default ComingSoon;