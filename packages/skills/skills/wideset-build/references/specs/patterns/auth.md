# Sign in and sign up

> The screens before the app: one form in a raised card, a footer that says how to leave, and
> error messages that never tell a stranger which half of a password pair was wrong.

## Problem

A sign-in screen has one job, so everything that is not the form gets in the way, and everything
the form does wrong costs a person their way in: a field a password manager cannot fill, a paste
it refuses, an error that hides where the problem is, or one that tells an attacker which e-mail
has an account. Wideset has no auth components: the screen is a `<form>` of `FormField`s, a
`Checkbox` and a `Button`, in a card drawn with `ws` tokens.

Start from a starting point; each is rebuilt from Wideset Core's Sign In screens:

| Block          | Layout                                                     | Use it when                                                                |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| `sign-in`      | The form card beside a dark card with a picture of the app | The product has something to show and the window is wide                   |
| `sign-in-card` | The form card alone, centred                               | An internal tool, an admin, a product with nothing to show yet             |
| `sign-up`      | The form card alone, creating an account                   | Every sign-up; derived from the sign-in card (Figma has no sign-up screen) |

Their code is at `https://wideset.co/blocks/<id>.md`.

## Layout

- **No navigation.** The person is not in the app yet: no sidebar, no top bar, no account menu.
  The page is `bg-ws-static-background`; the card is `bg-ws-static-foreground`,
  `rounded-ws-container-xl`, `shadow-ws-low` (in dark the lighter surface carries it, as in the
  Inset direction).
- **The card** is 620px wide (`max-w-[38.75rem]`) and 740px tall, or the window less the page's
  24px padding when that is shorter, never shorter than its content. Inside, `p-ws-18` (48px,
  `p-ws-12` on a phone) and one `gap-ws-12` (24px) between every part: icon, title, fields,
  checkbox, button, help line. The fields are as wide as the card's content (524px). The footer
  sits at the bottom of the card on `bg-ws-static-alpha-subtle`, `px-ws-12 py-ws-9`.
- **Split** (`sign-in`): two cards of the same size, `gap-ws-9` (16px) apart, centred on the page.
  Under 1280px the picture goes and the form card stays, centred; a phone gets the card alone.
  The picture is decorative (`aria-hidden`, `inert`): the app at a small scale, or your own image.
  The form card follows the theme; the picture's card and the app icon keep their colours in dark.
- **Controls.** The fields are `md` (40px); the submit is the one exception to one control size
  per screen: `Button size="lg"` (48px), full width, the only filled button. Everything else on
  the card is text or a link.

## Anatomy

```
main.bg-ws-static-background (centres the card)
└ card                                   — white, raised, footer pinned to the bottom
  ├ body (p-ws-18, gap-ws-12)
  │ ├ app icon                           — the product's mark, decorative
  │ └ form noValidate aria-labelledby    — a real form: Enter submits from any field
  │   ├ h1 typography-title-md           — "Sign in to Wideset", one per screen
  │   ├ FormField > TextInput            — "E-mail or username", focused on load
  │   ├ FormField > TextInput            — "Password"
  │   ├ Checkbox                         — "Keep me signed in"
  │   ├ Button type="submit" size="lg"   — "Sign in", full width
  │   └ p                                — help line: magic link, reset password
  └ footer                               — Back (Esc) … the other screen (↑ ↓)
```

## Example

The sign-in form with the server's answer wired in. A wrong pair gets one message above the
fields, never a mark on one of them.

```tsx
import { Button, Checkbox, FormField, InlineAlert, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

type Field = 'username' | 'password';

export function SignInForm({
  signIn,
}: {
  signIn: (username: string, password: string) => Promise<boolean>;
}) {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [rejected, setRejected] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const next = {
      username: username ? undefined : 'Enter your e-mail or username.',
      password: password ? undefined : 'Enter your password.',
    };
    setErrors(next);
    const invalid = (Object.keys(next) as Field[]).find((field) => next[field]);
    if (invalid) {
      document.getElementById(`${id}-${invalid}`)?.focus();
      return;
    }
    setBusy(true);
    const signedIn = await signIn(username, password);
    setBusy(false);
    if (signedIn) {
      window.location.assign('/');
      return;
    }
    setRejected(true);
    document.getElementById(`${id}-password`)?.focus();
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex flex-col"
    >
      <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
        Sign in to Wideset
      </h1>
      {rejected && (
        <InlineAlert
          status="error"
          persistent
          title="That e-mail and password don't match"
          message="Check both, or reset your password."
        />
      )}
      <FormField label="E-mail or username" htmlFor={`${id}-username`} errorText={errors.username}>
        <TextInput
          id={`${id}-username`}
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          autoFocus
          variant={errors.username ? 'danger' : 'primary'}
        />
      </FormField>
      <FormField label="Password" htmlFor={`${id}-password`} errorText={errors.password}>
        <TextInput
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          variant={errors.password ? 'danger' : 'primary'}
        />
      </FormField>
      <Checkbox name="remember" label="Keep me signed in" />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        Sign in
      </Button>
    </form>
  );
}
```

## Fields

- **Labels.** Every field has a visible `FormField` label; a placeholder is an example
  ("e.g. hello@wideset.co"), never the label. Sign in asks for two things, sign up for four at
  most: name, work e-mail, password, the terms. Ask the rest inside the app.
- **Autocomplete and names**, which password managers and phones read:

  | Field                       | `type`     | `autoComplete`     | `name`     |
  | --------------------------- | ---------- | ------------------ | ---------- |
  | Sign in: e-mail or username | `text`     | `username`         | `username` |
  | Sign in: password           | `password` | `current-password` | `password` |
  | Sign up: name               | `text`     | `name`             | `name`     |
  | Sign up: work e-mail        | `email`    | `email`            | `email`    |
  | Sign up: password           | `password` | `new-password`     | `password` |

  An identifier also takes `autoCapitalize="none"` and `spellCheck={false}`. A new password takes
  `minLength`, so a password manager generates one the form accepts, and says the rule in
  `helperText` before anyone types.

- **Password managers** need a real `<form>` with a `type="submit"` button, stable `name`s, the
  username and password in the same form, and paste left alone. Never block paste, split one
  password into boxes, or ask for the password before the username exists on the page.
- **Show and hide.** A new password gets a reveal button (below), not a second "confirm" field.
- **Terms** on sign up are a `Checkbox`, not a `Switch` (they are read with the form), unticked,
  with the documents as links in its label. Checked on submit like a field.
- **Errors.** On submit, say at each field what is missing or malformed, in `FormField`
  `errorText` with the control's `variant="danger"`, and move focus to the first. Clear a field's
  error as soon as it is typed into; never validate while someone types. The server's answer is
  different: a wrong pair is one `InlineAlert` above the fields ("That e-mail and password don't
  match"), never "No account with this e-mail" or a red password field, which tell an attacker
  what exists. Keep the username after a failed attempt.

### Reveal a new password

`TextInput.IconButton` in `TextInput.Suffix inner` switches `TextInput.Input`'s `type`. Its name
says what it does next ("Show password", "Hide password"); it is a `Button`, so it never submits.

```tsx
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { FormField, TextInput } from '@wideset/react';
import { useState } from 'react';

export function NewPassword() {
  const [shown, setShown] = useState(false);
  return (
    <FormField label="Password" htmlFor="new-password" helperText="At least 8 characters.">
      <TextInput
        id="new-password"
        name="password"
        autoComplete="new-password"
        minLength={8}
        required
      >
        <TextInput.Input type={shown ? 'text' : 'password'} />
        <TextInput.Suffix inner>
          <TextInput.IconButton
            icon={shown ? RiEyeOffLine : RiEyeLine}
            aria-label={shown ? 'Hide password' : 'Show password'}
            onClick={() => setShown((value) => !value)}
          />
        </TextInput.Suffix>
      </TextInput>
    </FormField>
  );
}
```

## Magic link and reset

The help line under the button holds the two ways out of a forgotten password, as links in the
sentence: a magic sign-in link and a password reset. Each opens its own screen in the same card:
one e-mail field and one button. Its answer is the same whether the account exists or not ("If
there is an account for hello@wideset.co, a link is on its way"), and says how long the link
lasts. A reset link opens a new-password form; nothing ever shows the old password.

## Keyboard

- The first field has focus when the screen opens; Enter submits from any field.
- Tab order: the fields, the checkbox, the submit, the help links, Back, the other screen.
- **Esc** goes back from anywhere, **←** goes back outside a text field, **↑** or **↓** outside a
  text field opens the other screen (sign in ↔ create account). Inside a field the arrows stay
  with the field: they move the caret and open the browser's autofill.

## What the footer hints mean

The footer is a legend of the card's two exits, and each hint is the exit itself: Back is a
button (`history.back()`), the other screen is a link. The keys are drawn like Figma's `xs`
border buttons, as `kbd`, hidden from screen readers; the control carries the shortcut in
`aria-keyshortcuts`. Show only keys that work. On a phone the keys mean nothing, but the two
exits still do.

## Accessibility

- The form is named by its title (`aria-labelledby`); there is one `h1`.
- `noValidate` on the form, so the field errors are the only ones; `required` on each control.
- Autofocus only on a screen whose one task is this form, never inside a page with other content
  or in a dialog that opens by itself.
- The decorative half of the split and the app icon are hidden from screen readers; the picture is
  `inert` so nothing in it takes focus.

## Anti-patterns

- The app's sidebar or top bar on a sign-in screen.
- A disabled submit until the form is valid, instead of errors on submit.
- "Invalid credentials" under the password field, or "Unknown e-mail": both name the wrong half.
- Clearing the e-mail after a failed attempt, or validating while the person types.
- Two filled buttons ("Sign in" and "Sign up"), or social sign-in drawn as filled primaries; the
  other screen is a link.
- Placeholders as labels, a confirm-password field instead of a reveal button, or blocked paste.
- Arrow-key shortcuts that fire inside a text field, or hints for keys that do nothing.
