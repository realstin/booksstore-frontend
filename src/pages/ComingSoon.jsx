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

        {/* Real logo from public folder */}
        <div className="coming-soon__logo">
          <img
            src="/bookstorelogo.svg"
            alt="BooksStore logo"
            className="coming-soon__logo-icon"
          />
          <span className="coming-soon__logo-name">BooksStore</span>
        </div>

        <div className="coming-soon__accent" />

        <h1 className="coming-soon__title">
          Building your<br />library.
        </h1>

        <p className="coming-soon__subtitle">
          A space to discover, read, and keep real books.
          We believe the best gift we can give is a book.
        </p>

        <p className="coming-soon__motto">Read · Learn · Rest · Grow</p>

        <footer className="coming-soon__footer">
          <StatusBadge status={status} />
        </footer>

      </div>
    </main>
  );
}

export default ComingSoon;
