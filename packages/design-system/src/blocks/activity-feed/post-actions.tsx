import { RiChat3Line, RiShareForwardLine, RiThumbUpFill, RiThumbUpLine } from '@remixicon/react';
import { Button } from '@wideset/react';

type PostActionsProps = {
  likes: number;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  /** Left out on an event Orbit reports: there is nothing of a person's to pass on. */
  onShare?: () => void;
};

/**
 * What a reader does with a post: like it, comment, share it. Quiet ghost buttons, pulled left so
 * the first icon sits on the text's edge. Like is a toggle: pressed, it takes the selected
 * (brand) colour and a filled icon, and its count, shown only above zero, moves with it.
 */
export function PostActions({ likes, liked, onLike, onComment, onShare }: PostActionsProps) {
  return (
    <div className="gap-ws-3 -ml-ws-6 flex items-center">
      <Button
        size="sm"
        variant={liked ? 'primary' : 'secondary'}
        preset="ghost"
        aria-pressed={liked}
        onClick={onLike}
      >
        <Button.Icon icon={liked ? RiThumbUpFill : RiThumbUpLine} />
        Like
        {likes > 0 && <span className="text-ws-static-subtle tabular-nums">{likes}</span>}
      </Button>
      <Button size="sm" variant="secondary" preset="ghost" onClick={onComment}>
        <Button.Icon icon={RiChat3Line} />
        Comment
      </Button>
      {onShare && (
        <Button size="sm" variant="secondary" preset="ghost" onClick={onShare}>
          <Button.Icon icon={RiShareForwardLine} />
          Share
        </Button>
      )}
    </div>
  );
}
