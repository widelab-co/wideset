// TODO(custom): the transcript's motion as class recipes built from the motion tokens; Wideset keeps its recipes inside its components.

/** A part arriving in the transcript (a step, a card, the working line): a few pixels up, fading in. */
export const ARRIVE =
  'animate-in fade-in-0 slide-in-from-bottom-ws-4 duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)';

/** An icon taking another's place (a spinner's check, Send's Stop, Copy's tick): it fades and grows in. */
export const SWAP =
  'animate-in fade-in-0 zoom-in-75 duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-in-out)';
