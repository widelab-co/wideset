// TODO(custom): a reported item folded away for the reporter, with the way to see it; Wideset has no hidden-content placeholder.
import { RiEyeOffLine } from '@remixicon/react';
import { Button, cn } from '@wideset/react';

type HiddenNoticeProps = {
  /** What it says in place of the item: `You reported Leo Marchetti’s comment.` */
  children: string;
  onShow: () => void;
  /** The gutter the icon sits in, so it lines up with the avatars around it. */
  gutterClassName: string;
};

/**
 * What a reporter sees where the item they reported was: an eye crossed out in the avatar's
 * gutter, one quiet sentence, and Show anyway. Grey and small, so the thread reads on past it.
 */
export function HiddenNotice({ children, onShow, gutterClassName }: HiddenNoticeProps) {
  return (
    <div className="gap-ws-5 flex items-center">
      <span className={cn('flex shrink-0 justify-center', gutterClassName)}>
        <RiEyeOffLine aria-hidden="true" className="size-ws-9 text-ws-static-subtle" />
      </span>
      <p className="typography-body-md text-ws-static-subtle min-w-0">
        {children} It’s hidden for you.
      </p>
      <Button size="sm" variant="secondary" preset="ghost" onClick={onShow} className="shrink-0">
        Show anyway
      </Button>
    </div>
  );
}
