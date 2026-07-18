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
    sm: "h-12 px-9 text-[14.5px]",
    md: "h-12 px-8 text-[15px]",
    lg: "h-14 px-10 text-base",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-300 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
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