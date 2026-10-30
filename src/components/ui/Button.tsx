import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "outline";

type CommonProps = {
  variant?: Variant;
  /** Icon placed before the label (or after it with `iconEnd`). */
  icon?: ReactNode;
  iconEnd?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = LinkProps | NativeButtonProps;

const base =
  "inline-flex h-11 items-center justify-center gap-2.5 border-2 border-ink px-[18px] text-[13px] font-semibold tracking-label uppercase no-underline select-none " +
  // brutalist press: lift on hover, slam flat on press
  "transition-[transform,box-shadow,background-color,color] duration-[80ms] ease-out " +
  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-press " +
  "active:translate-x-0 active:translate-y-0 active:shadow-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-signal hover:text-ink",
  outline: "bg-paper text-ink",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    icon,
    iconEnd = false,
    fullWidth = false,
    children,
    className = "",
    ...rest
  } = props;

  const classes = `${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`;
  const content = (
    <>
      {!iconEnd && icon}
      <span>{children}</span>
      {iconEnd && icon}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as LinkProps)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as NativeButtonProps)}
    >
      {content}
    </button>
  );
}
