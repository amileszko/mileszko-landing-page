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
      height={720}
      playsInline
      poster="/intro.webp"
      preload="none"
      width={1280}
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
