import { cn } from "@utils/classNameUtils";

const LogoImage = ({
  alt,
  className,
  src,
  ...props
}: React.ComponentProps<"img">) => {
  return (
    <img
      alt={alt}
      className={
        cn(
          `
            h-6 object-contain grayscale
            md:h-8
          `,
          className,
        )
      }
      src={src}
      {...props}
    />
  );
};

export { LogoImage };
