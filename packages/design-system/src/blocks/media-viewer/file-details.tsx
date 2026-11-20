import { CommentField } from './comment-field';
import { CommentList } from './comment-list';
import { type Access, type FileItem, FOLDER, KIND_LABEL, PEOPLE, type PersonId } from './data';
import { FactsList } from './facts-list';
import { formatModified, formatSize } from './format';
import { PersonAvatar } from './person-avatar';

const TITLE = 'typography-label-strong-md text-ws-static-strong';

/**
 * The file's details beside it, in three sections split by space: the facts (kind, size, where
 * it lives, owner, last change), who it is shared with and how, and the comments with a field
 * to add one. It scrolls on its own, so the file stays put.
 */
export function FileDetails({
  file,
  onComment,
}: {
  file: FileItem;
  onComment: (text: string) => void;
}) {
  const people: { person: PersonId; access: Access }[] = [
    { person: file.owner, access: 'Owner' },
    ...file.sharedWith,
  ];

  return (
    <aside
      aria-label="File details"
      className="border-ws-static-subtle w-[20rem] shrink-0 overflow-y-auto border-l"
    >
      <div className="gap-ws-14 p-ws-11 flex flex-col">
        <section className="gap-ws-9 flex flex-col">
          <h3 className={TITLE}>Details</h3>
          <FactsList
            groups={[
              [
                { label: 'Type', value: KIND_LABEL[file.kind] },
                { label: 'Size', value: formatSize(file.size) },
                { label: 'Location', value: FOLDER.path.join(' / ') },
                { label: 'Owner', value: PEOPLE[file.owner].name },
                { label: 'Modified', value: formatModified(file.modified) },
                { label: 'Modified by', value: PEOPLE[file.modifiedBy].name },
              ],
            ]}
          />
        </section>

        <section className="gap-ws-9 flex flex-col">
          <h3 className={TITLE}>Shared with</h3>
          <ul className="gap-ws-7 flex flex-col">
            {people.map(({ person, access }) => (
              <li key={person} className="gap-ws-5 flex items-center">
                <PersonAvatar
                  size="sm"
                  name={PEOPLE[person].name}
                  initials={PEOPLE[person].initials}
                  color={PEOPLE[person].color}
                  aria-hidden
                />
                <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
                  {PEOPLE[person].name}
                </span>
                <span className="typography-label-sm text-ws-static-subtle">{access}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="gap-ws-9 flex flex-col">
          <h3 className={TITLE}>Comments</h3>
          <CommentList comments={file.comments} />
          <CommentField onComment={onComment} />
        </section>
      </div>
    </aside>
  );
}
