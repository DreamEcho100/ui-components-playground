'use client';

import { Badge } from '~/components/ui/badge';
import ShowcaseArticle from '../article';
import { useState } from 'react';

const badgeThemes = /** @type {const} */ ([
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'success',
  'warning',
  'link',
  'info',
  'dark',
  'light',
]);
const badgeSize = /** @type {const} */ (['sm', 'md', 'lg']);
const badgeRounded = /** @type {const} */ (['md', 'square', 'pill']);

export default function BadgesShowCase() {
  const [size, setSize] = useState(
    /** @type {import('~/components/ui/badge/types').BadgeProps['size'] | null} */ (
      'md'
    ),
  );
  const [rounded, setRounded] = useState(
    /** @type {import('~/components/ui/badge/types').BadgeProps['rounded'] | null} */ (
      'pill'
    ),
  );

  return (
    <ShowcaseArticle
      header={{
        title: 'Badges',
        description:
          'Badges are used to display a small amount of information.',
      }}
      sections={[
        {
          title: 'Themes',
          description: 'Badges come in different themes.',
          content: (
            <>
              <div className="flex flex-wrap gap-4">
                <label className="flex flex-wrap items-center gap-1">
                  <span>Select size:</span>
                  <select
                    className="w-32 p-2 rounded-md border border-solid border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    value={size ?? ''}
                    onChange={(e) =>
                      setSize(/** @type {any} */ (e.target.value))
                    }
                  >
                    {badgeSize.map((size) => (
                      <option key={size ?? 'none'} value={size ?? 'none'}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-wrap items-center gap-1">
                  <span>Select rounded:</span>
                  <select
                    className="w-32 p-2 rounded-md border border-solid border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    value={rounded ?? ''}
                    onChange={(e) =>
                      setRounded(/** @type {any} */ (e.target.value))
                    }
                  >
                    {badgeRounded.map((rounded) => (
                      <option key={rounded ?? 'none'} value={rounded ?? 'none'}>
                        {rounded}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                {badgeThemes.map((theme) => (
                  <Badge
                    key={theme}
                    variant={theme}
                    size={size}
                    rounded={rounded}
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
