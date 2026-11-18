import { Chip } from '@wideset/react';

/**
 * Three short things to ask, above the composer when the conversation is empty or has come to an
 * end: one press asks it. They are suggestions, so quiet bordered chips.
 */
export function SuggestedPrompts({
  prompts,
  onPick,
}: {
  prompts: string[];
  onPick: (prompt: string) => void;
}) {
  return (
    <div role="group" aria-label="Suggested questions" className="gap-ws-3 flex flex-wrap">
      {prompts.map((prompt) => (
        <Chip key={prompt} variant="secondary" style="border" onClick={() => onPick(prompt)}>
          {prompt}
        </Chip>
      ))}
    </div>
  );
}
