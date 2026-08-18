/**
 * BookReaderV2 — Phase 1: PDF.js rendering foundation
 *
 * HOW TO ACCESS
 *   /dashboard/books/:id/read?v=2   → this component (PDF.js)
 *   /dashboard/books/:id/read       → original BookReader (iframe, unchanged)
 *
 * RENDERING APPROACH — Phase 1
 * All pages are rendered sequentially. Each <Page> renders independently
 * as PDF.js finishes processing it — so page 1 appears first, then page 2,
 * etc. No virtualization yet; that belongs to Phase 2 once correctness is
 * confirmed.
 *
 * PDF SOURCE
 * Backend streaming proxy at /api/books/:id/pdf with withCredentials: true
 * so the HTTP-only JWT cookie is sent automatically.
 */

import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBookById } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL;

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

/* ── Shared UI ─────────────────────────────────────────────────────────── */

function StatusRow({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        {children}
      </div>
    </div>
  );
}

function Label({ children, muted }) {
  return (
    <p className={`text-[13.5px] leading-relaxed ${muted ? 'text-neutral-500' : 'text-neutral-200'}`}>
      {children}
    </p>
  );
}

function Spinner({ small }) {
  return (
    <div
      className={`animate-spin rounded-full border-neutral-700 border-t-neutral-300 ${
        small ? 'h-4 w-4 border' : 'h-6 w-6 border-2'
      }`}
      aria-label="Loading…"
    />
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-[13px] font-medium text-neutral-300 transition hover:border-neutral-400 hover:text-white focus:outline-none"
    >
      ← Back to book
    </button>
  );
}

/* ── Page width helper ─────────────────────────────────────────────────── */
function getPageWidth() {
  // max-w-4xl container with px-4 padding on each side
  return Math.min(864, window.innerWidth - 32);
}

/* ── BookReaderV2 ──────────────────────────────────────────────────────── */
function BookReaderV2() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const goBack = useCallback(
    () => navigate(`/dashboard/books/${id}`),
    [navigate, id],
  );

  /* Book metadata */
  const [book,       setBook]       = useState(null);
  const [bookStatus, setBookStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setBookStatus('loading');
    setBook(null);
    getBookById(id)
      .then((data) => {
        if (cancelled) return;
        setBook(data?.book ?? data);
        setBookStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setBookStatus(err.status === 404 ? 'notfound' : 'error');
      });
    return () => { cancelled = true; };
  }, [id]);

  /* PDF.js state */
  const [numPages,  setNumPages]  = useState(null);
  const [pdfStatus, setPdfStatus] = useState('idle');
  const [pdfError,  setPdfError]  = useState(null);

  /* Book loading guards */
  if (bookStatus === 'loading') {
    return <StatusRow><Spinner /><Label muted>Loading book…</Label></StatusRow>;
  }
  if (bookStatus === 'notfound') {
    return <StatusRow><Label>Book not found.</Label><BackButton onClick={goBack} /></StatusRow>;
  }
  if (bookStatus === 'error') {
    return <StatusRow><Label>Could not load book metadata.</Label><BackButton onClick={goBack} /></StatusRow>;
  }
  if (!book?._id) {
    return <StatusRow><Label>This book could not be identified.</Label><BackButton onClick={goBack} /></StatusRow>;
  }

  const pdfProxyUrl = `${API_URL}/api/books/${book._id}/pdf`;
  const pageWidth   = getPageWidth();

  return (
    <div className="min-h-screen bg-neutral-950" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Header ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/6 bg-[#1a1a1a] px-4 sm:px-6"
        style={{ height: '52px' }}
      >
        <button
          type="button"
          onClick={goBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/[0.07] hover:text-white focus:outline-none"
          aria-label="Back to book details"
        >
          ←
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white" style={{ maxWidth: '320px' }}>
            {book.title ?? 'Book'}
          </p>
          <p className="text-[11px] font-medium text-neutral-400">
            BookReaderV2 — Phase 1 experimental
          </p>
        </div>

        {/* Spinner while PDF.js is still fetching/parsing */}
        {pdfStatus === 'loading' && <Spinner small />}

        {/* Page count once PDF.js knows it */}
        {numPages !== null && (
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-white/70">
            {numPages} {numPages === 1 ? 'page' : 'pages'}
          </span>
        )}
      </div>

      {/* ── Error banner ── */}
      {pdfStatus === 'error' && (
        <div className="border-b border-red-900/50 bg-red-950/40 px-5 py-4">
          <p className="mb-1 text-[13px] font-semibold text-red-300">
            PDF.js could not load the PDF
          </p>
          <p className="mb-2 text-[12px] leading-relaxed text-red-400">
            {pdfError?.message ?? 'Unknown error'}
          </p>
          <p className="text-[11.5px] text-neutral-500">
            The PDF is fetched through the backend proxy. Check that the
            backend is reachable and that the JWT cookie is being sent.
          </p>
          <p className="mt-2 text-[11px] text-neutral-600">Proxy URL: {pdfProxyUrl}</p>
        </div>
      )}

      {/* ── PDF pages ── */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Document
          file={{ url: pdfProxyUrl, withCredentials: true }}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            setPdfStatus('success');
          }}
          onLoadError={(err) => {
            setPdfError(err);
            setPdfStatus('error');
          }}
          onLoadProgress={() => {
            if (pdfStatus === 'idle') setPdfStatus('loading');
          }}
          loading={
            /* Shown while PDF.js is fetching the document — before any pages render */
            <div className="flex flex-col items-center gap-4 py-16">
              <Spinner />
              <p className="text-[13px] text-neutral-500">
                Fetching PDF through backend proxy…
              </p>
              <p className="text-[11.5px] text-neutral-600">
                This may take a moment for large books.
              </p>
            </div>
          }
          error={null}
          className="flex flex-col items-center gap-4"
        >
          {/*
           * Render every page individually.
           *
           * Each <Page> renders itself as soon as PDF.js has processed that
           * page — so page 1 appears first, then page 2, and so on.
           * The `loading` prop on each <Page> shows a skeleton placeholder
           * while that specific page is being rasterised to canvas, so the
           * user sees real content appearing progressively rather than a
           * single long wait.
           *
           * No virtualization here — Phase 1 goal is correctness.
           * Virtualization (render only pages near the viewport) is Phase 2.
           */}
          {numPages !== null &&
            Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <div
                  key={pageNumber}
                  className="w-full overflow-hidden rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    loading={
                      /* Per-page skeleton — appears while this page rasterises */
                      <div
                        style={{
                          width:  pageWidth,
                          height: Math.round(pageWidth * 1.414), // A4 ratio
                        }}
                        className="flex flex-col items-center justify-center gap-3 bg-neutral-900"
                      >
                        <Spinner small />
                        <p className="text-[11px] text-neutral-600">Page {pageNumber}</p>
                      </div>
                    }
                    error={
                      <div
                        style={{ width: pageWidth, height: 120 }}
                        className="flex items-center justify-center bg-neutral-900"
                      >
                        <p className="text-[12px] text-red-400">
                          Page {pageNumber} failed to render.
                        </p>
                      </div>
                    }
                  />
                </div>
              );
            })
          }
        </Document>
      </div>
    </div>
  );
}

export default BookReaderV2;
