export function TriviaReveal({ trivia }: { trivia: string[] }) {
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2">
        {trivia.map((fact, i) => (
          <li
            key={i}
            className="materia-panel flex gap-4 rounded-lg p-5 text-sm leading-6 text-[#c4c6cd]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-[#7bd0ff]/20 bg-[#7bd0ff]/5 font-mono text-xs text-[#7bd0ff]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
