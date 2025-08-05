import { cn } from "@utils/classNameUtils";

const AvatarImage = ({
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
          "h-36 w-36 shrink-0 rounded-full object-cover",
          className,
        )
      }
      src={src}
      {...props}
    />
  );
};

export { AvatarImage };
