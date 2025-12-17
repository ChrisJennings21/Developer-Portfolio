interface TechTooltipProps {
  name: string | null;
  position: { x: number; y: number } | null;
}

export function TechTooltip({ name, position }: TechTooltipProps) {
  if (!name || !position) {
    return <div className="tech-tooltip" id="tech-tooltip" />;
  }

  return (
    <div
      className="tech-tooltip visible"
      id="tech-tooltip"
      style={{
        left: position.x + 20,
        top: position.y - 10,
      }}
    >
      {name}
    </div>
  );
}
