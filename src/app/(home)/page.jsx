import HorizontalBox from '~/components/ui/boxes/horizontal';
import InputsShowCase from './_components/show-cases/Inputs';
import AccordionsShowCase from './_components/show-cases/accordions';
import ButtonsShowSase from './_components/show-cases/buttons';
import CardsShowCase from './_components/show-cases/cards';
import ComboboxesShowSase from './_components/show-cases/comboboxes';
import SelectDropdownsShowcase from './_components/show-cases/select-dropdowns';
import TextareasShowCase from './_components/show-cases/textareas';
import DataTablesShowCase from './_components/show-cases/data-tables';
import { Input } from '~/components/ui/input';
import BadgesShowCase from './_components/show-cases/badges';
import TypographyShowcase from './_components/show-cases/typography';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <HorizontalBox
        className="w-fit"
        start={<span className="text-2xl px-1">🏠</span>}
        startSeparator
        end={<span className="text-2xl px-1">🏠</span>}
        endSeparator
      >
        <h1 className="text-4xl font-bold px-2">Home</h1>
      </HorizontalBox>

      <HorizontalBox
        className="w-fit"
        start={
          <label className="text-2xl px-2 py-1" htmlFor="search">
            🔍
          </label>
        }
        startSeparator
      >
        <Input
          placeholder="Search"
          className="border-0 ring-inset h-full"
          id="search"
          type="search"
        />
      </HorizontalBox>
      {/* <HorizontalBox className="toolbar">
        <Button icon="🔍" label="Search" />
        <Button icon="✏️" label="Edit" />
        <Button icon="🗑️" label="Delete" />
      </HorizontalBox> */}
      <HorizontalBox
        className="bg-warning text-warning-foreground"
        start={<span className="text-2xl px-4">🛈</span>}
        startSeparator
      >
        <div className="p-4">
          <h2 className="title">Information</h2>
          <p className="description">This is an info card.</p>
        </div>
      </HorizontalBox>

      <TypographyShowcase />
      <ButtonsShowSase />
      <AccordionsShowCase />
      <CardsShowCase />
      <ComboboxesShowSase />
      <SelectDropdownsShowcase />
      <InputsShowCase />
      <TextareasShowCase />
      <DataTablesShowCase />
      <BadgesShowCase />
    </main>
  );
}
