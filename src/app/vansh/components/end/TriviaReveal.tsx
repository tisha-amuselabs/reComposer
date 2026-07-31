export function TriviaReveal({ trivia }: { trivia: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Fun facts</h3>
      <ul className="flex flex-col gap-2">
        {trivia.map((fact, i) => (
          <li
            key={i}
            className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800"
          >
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
