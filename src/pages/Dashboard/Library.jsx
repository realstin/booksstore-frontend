import { motion } from 'framer-motion';
import { Library as LibraryIcon } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function Library() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease }}
        className="flex flex-col gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <LibraryIcon size={22} strokeWidth={1.75} className="text-neutral-700" aria-hidden="true" />
        </div>

        <div>
          <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            My Library
          </p>
          <h1 className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold tracking-[-0.02em] text-neutral-950">
            Your Personal Library
          </h1>
          <p className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500">
            All the books you save will live here. Build your personal reading
            collection and return to them any time.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
          <LibraryIcon size={36} strokeWidth={1.25} className="mx-auto mb-4 text-neutral-300" aria-hidden="true" />
          <p className="text-[14px] text-neutral-400">
            Your saved books will appear here once you start building your library.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Library;
