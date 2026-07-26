import { motion } from "framer-motion";

export function AuthorCard({ author }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6"
    >
      {/* Avatar */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-950 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
        <span className="text-[1.1rem] font-bold tracking-tight text-white">
          {author.initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Written by
        </p>
        <p className="text-[15px] font-bold tracking-tight text-neutral-950">
          {author.name}
        </p>
        <p className="text-[13px] text-neutral-500">{author.role}</p>
      </div>
    </motion.div>
  );
}

export default AuthorCard;
