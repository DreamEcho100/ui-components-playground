import HorizontalBox from "~/components/ui/boxes/horizontal";
import InputsShowCase from "./_components/show-cases/Inputs";
import AccordionsShowCase from "./_components/show-cases/accordions";
import ButtonsShowSase from "./_components/show-cases/buttons";
import CardsShowCase from "./_components/show-cases/cards";
import ComboboxesShowSase from "./_components/show-cases/comboboxes";
import SelectDropdownsShowcase from "./_components/show-cases/select-dropdowns";
import TextareasShowCase from "./_components/show-cases/textareas";
import DataTablesShowCase from "./_components/show-cases/data-tables";
import { Input } from "~/components/ui/input";
import ChipsShowCase from "./_components/show-cases/chips";
import TypographyShowcase from "./_components/show-cases/typography";
import BreadcrumbsShowCase from "./_components/show-cases/breadcrumbs";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <HorizontalBox
        className="w-fit"
        start={<span className="px-1 text-2xl">🏠</span>}
        startSeparator
        end={<span className="px-1 text-2xl">🏠</span>}
        endSeparator
      >
        <h1 className="px-2 text-4xl font-bold">Home</h1>
      </HorizontalBox>

      <HorizontalBox
        className="w-fit"
        start={
          <label className="px-2 py-1 text-2xl" htmlFor="search">
            🔍
          </label>
        }
        startSeparator
      >
        <Input
          placeholder="Search"
          className="h-full border-0 ring-inset"
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
        start={<span className="px-4 text-2xl">🛈</span>}
        startSeparator
      >
        <div className="p-4">
          <h2 className="title">Information</h2>
          <p className="description">This is an info card.</p>
        </div>
      </HorizontalBox>
      <BreadcrumbsShowCase />
      <TypographyShowcase />
      <ButtonsShowSase />
      <AccordionsShowCase />
      <CardsShowCase />
      <ComboboxesShowSase />
      <SelectDropdownsShowcase />
      <InputsShowCase />
      <TextareasShowCase />
      <DataTablesShowCase />
      <ChipsShowCase />
    </main>
  );
}
