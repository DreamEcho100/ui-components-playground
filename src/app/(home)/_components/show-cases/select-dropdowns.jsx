'use client';
import { SelectDropdown } from '~/components/ui/select';
import ShowcaseArticle from '../article';

const selectThemes = [
  {
    value: 'system',
    label: 'System',
  },
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
];

export default function SelectDropdownsShowcase() {
  return (
    <ShowcaseArticle
      header={{
        title: 'Select Dropdown',
        description:
          'Select dropdowns are used to select an option from a list.',
      }}
      sections={[
        {
          title: 'Themes and Sizes',
          description: 'Select dropdowns come in different themes and sizes.',
          content: (
            <>
              <div className="flex flex-wrap gap-4">
                <SelectDropdown
                  placeholder="Select a theme"
                  options={selectThemes}
                />
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
