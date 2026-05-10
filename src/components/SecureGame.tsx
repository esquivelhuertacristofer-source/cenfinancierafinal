"use client";

/**
 * @interface SecureGameProps
 * @description Props for the SecureGame component
 */
interface SecureGameProps {
  gameTitle: string;
  gameHtml: string;
}

/**
 * @component SecureGame
 * @description Sandboxed iframe container for rendering educational game content
 * @security Uses sandbox attribute to restrict iframe capabilities
 */
export default function SecureGame({ gameTitle, gameHtml }: SecureGameProps) {
  return (
    <div className="w-full aspect-video rounded-[3rem] overflow-hidden bg-white shadow-2xl">
      <iframe
        title={gameTitle}
        srcDoc={gameHtml}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
    </div>
  );
}
