import HorizontalBox from '~/components/ui/boxes/horizontal';
import InputsShowCase from './_components/show-cases/Inputs';
import AccordionsShowCase from './_components/show-cases/accordions';
import ButtonsShowSase from './_components/show-cases/buttons';
import CardsShowCase from './_components/show-cases/cards';
import ComboboxesShowSase from './_components/show-cases/comboboxes';
import SelectDropdownsShowcase from './_components/show-cases/select-dropdowns';
import TextareasShowCase from './_components/show-cases/textareas';
import DataTablesShowCase from './_components/show-cases/data-tables';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <HorizontalBox
        className="w-fit"
        start={<span className="text-2xl">🏠</span>}
        startSeparator
        end={<span className="text-2xl">🏠</span>}
        endSeparator
      >
        <h1 className="text-4xl font-bold">Home</h1>
      </HorizontalBox>
      <ButtonsShowSase />
      <AccordionsShowCase />
      <CardsShowCase />
      <ComboboxesShowSase />
      <SelectDropdownsShowcase />
      <InputsShowCase />
      <TextareasShowCase />
      <DataTablesShowCase />
    </main>
  );
}
