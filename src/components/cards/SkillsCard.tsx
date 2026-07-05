const skills = [
  { label: "React", color: "#60a5fa", x: 10, y: 16, r: -12 },
  { label: "Next.js", color: "#a1a1aa", x: 82, y: 6, r: 8 },
  { label: "TypeScript", color: "#818cf8", x: 162, y: 20, r: -5 },
  { label: "Tailwind CSS", color: "#22d3ee", x: 36, y: 52, r: 14 },
  { label: "JavaScript", color: "#fbbf24", x: 124, y: 44, r: -8 },
  { label: "GSAP", color: "#34d399", x: 6, y: 96, r: 5 },
  { label: "Three.js", color: "#a78bfa", x: 72, y: 88, r: -7 },
  { label: "UI Development", color: "#f472b6", x: 158, y: 82, r: 12 },
  { label: "Responsive Design", color: "#fb923c", x: 22, y: 132, r: -4 },
  { label: "Git & GitHub", color: "#94a3b8", x: 108, y: 128, r: 6 },
  { label: "REST APIs", color: "#2dd4bf", x: 188, y: 118, r: -10 },
  { label: "Performance", color: "#f87171", x: 58, y: 168, r: 8 },
];

export default function SkillsCard() {
  return (
    <div className="card relative h-full overflow-hidden rounded-xl">
      {skills.map((skill) => (
        <span
          key={skill.label}
          className="absolute rounded-full border px-2.5 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm"
          style={{
            left: skill.x,
            top: skill.y,
            transform: `rotate(${skill.r}deg)`,
            borderColor: skill.color,
            color: skill.color,
            backgroundColor: `${skill.color}18`,
          }}
        >
          {skill.label}
        </span>
      ))}
    </div>
  );
}
