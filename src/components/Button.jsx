import clsx from "clsx";

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-black shadow-sm hover:shadow-md",
    secondary: "border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50",
  };

  const sizes = {
    sm: "h-10 px-5 text-[13px]",
    md: "h-11 px-6 text-[14px]",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-300 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;