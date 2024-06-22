/**
 * @param {{
 *  header: {
 * 		title: string;
 * 		description: string | string[];
 * 	};
 * 	sections: {
 * 		title: string;
 * 		description: string | string[];
 * 		content: import("react").ReactNode
 * 	}[];
 * }} props
 */
export default function ShowcaseArticle(props) {
  return (
    <article className="flex flex-col gap-4 w-full border border-solid border-gray-300 dark:border-gray-700 p-4 rounded-md dark:bg-gray-800 dark:text-gray-300">
      <header>
        <h2>{props.header.title}</h2>
        {/* <p>{props.header.description}</p> */}
        {Array.isArray(props.header.description) ? (
          <ul className="list-disc list-inside ms-2">
            {props.header.description.map((desc) => (
              <li key={desc}>{desc}</li>
            ))}
          </ul>
        ) : (
          <p>{props.header.description}</p>
        )}
      </header>
      <div className="flex flex-col gap-4 w-full">
        {props.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-4 w-full">
            <header className="flex flex-col gap-0.5">
              <h3>{section.title}</h3>
              {Array.isArray(section.description) ? (
                <ul className="list-disc list-inside ms-2">
                  {section.description.map((desc) => (
                    <li key={desc}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.description}</p>
              )}
            </header>
            {section.content}
          </section>
        ))}
      </div>
    </article>
  );
}
