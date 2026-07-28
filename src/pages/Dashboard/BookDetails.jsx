import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

/**
 * BookDetails — placeholder.
 * Full implementation (cover, description, read, save, download)
 * will be built in the next step.
 */
function BookDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-10">

      {/* Back button */}
      <motion.button
        type="button"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        aria-label="Go back"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.05, ease }}
        className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-20 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <BookOpen size={24} strokeWidth={1.75} className="text-neutral-600" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Book Details
          </p>
          <h1 className="text-[1.3rem] font-bold tracking-tight text-neutral-950">
            Coming Soon
          </h1>
          <p className="max-w-sm text-[14px] leading-relaxed text-neutral-500">
            The full book details experience — cover, description, read online,
            save to library, and download — is being built in the next step.
          </p>
          <p className="mt-2 font-mono text-[11px] text-neutral-300">
            book id: {id}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default BookDetails;
