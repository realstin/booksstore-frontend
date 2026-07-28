import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function Explore() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease }}
        className="flex flex-col gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <Compass size={22} strokeWidth={1.75} className="text-neutral-700" aria-hidden="true" />
        </div>

        <div>
          <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Explore
          </p>
          <h1 className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold tracking-[-0.02em] text-neutral-950">
            Discover Books
          </h1>
          <p className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500">
            Browse trusted, carefully selected technology books across all
            categories. Full explore functionality is coming soon.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-16 text-center">
          <Compass size={36} strokeWidth={1.25} className="mx-auto mb-4 text-neutral-300" aria-hidden="true" />
          <p className="text-[14px] text-neutral-400">
            Book discovery is being built. Check back soon.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Explore;
