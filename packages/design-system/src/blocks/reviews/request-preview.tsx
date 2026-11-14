// TODO(custom): an outlined frame on the modal's surface; Card paints the page's container fill, which in dark mode is a step darker than a modal.
import { useId, useState } from 'react';

import { workspace } from './data';
import { StarRatingInput } from './star-rating';

/**
 * What the customer gets: the question, the note when there is one, and the stars to answer with.
 * The stars work, so whoever sends the request can try what they are asking for; the rating picked
 * here stays here. One outline and no fill: the only frame inside the modal.
 */
export function RequestPreview({ message }: { message: string }) {
  const name = useId();
  const [rating, setRating] = useState(0);
  const question = `How was working with ${workspace.name}?`;

  return (
    <div className="border-ws-static-base rounded-ws-container-md gap-ws-7 p-ws-9 flex flex-col border">
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">{question}</p>
        {message.trim() && (
          <p className="typography-body-md text-ws-static-base whitespace-pre-line">
            {message.trim()}
          </p>
        )}
      </div>
      {/* Pulled left by the stars' own padding, so the first star sits on the text's edge. */}
      <StarRatingInput
        name={name}
        label={question}
        value={rating}
        onValueChange={setRating}
        className="-ml-ws-1 self-start"
      />
    </div>
  );
}
