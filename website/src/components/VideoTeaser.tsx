import { cn } from "@utils/classNameUtils";

const VideoTeaser = ({
  className,
  ...props
}: React.ComponentProps<"video">) => {
  return (
    <video
      className={
        cn(
          "w-full",
          className,
        )
      }
      controls
      poster="/intro.webp"
      {...props}
    >
      <source
        src="/intro.mp4"
        type="video/mp4"
      />
      <track
        default
        kind="captions"
        label="Polski"
        src="/captions.vtt"
        srcLang="pl"
      />
    </video>
  );
};

export { VideoTeaser };
