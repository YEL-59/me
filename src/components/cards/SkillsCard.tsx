"use client";

import Matter from "matter-js";
import { useEffect, useRef } from "react";

type Skill = {
  label: string;
  color: string;
};

const skills: Skill[] = [
  { label: "React", color: "#60a5fa" },
  { label: "Next.js", color: "#a1a1aa" },
  { label: "TypeScript", color: "#818cf8" },
  { label: "Tailwind CSS", color: "#22d3ee" },
  { label: "JavaScript", color: "#fbbf24" },
  { label: "GSAP", color: "#34d399" },
  { label: "Three.js", color: "#a78bfa" },
  { label: "UI Development", color: "#f472b6" },
  { label: "Responsive Design", color: "#fb923c" },
  { label: "Git & GitHub", color: "#94a3b8" },
  { label: "REST APIs", color: "#2dd4bf" },
  { label: "Performance", color: "#f87171" },
];

export default function SkillsCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      Engine,
      World,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Body,
    } = Matter;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } });
    const world = engine.world;

    const wallOpts: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      friction: 0.6,
      restitution: 0.2,
    };

    let walls: Matter.Body[] = [];

    const createWalls = (w: number, h: number) => [
      Bodies.rectangle(w / 2, h + 30, w + 120, 60, wallOpts),
      Bodies.rectangle(-30, h / 2, 60, h * 2, wallOpts),
      Bodies.rectangle(w + 30, h / 2, 60, h * 2, wallOpts),
      Bodies.rectangle(w / 2, -30, w + 120, 60, wallOpts),
    ];

    walls = createWalls(width, height);
    Composite.add(world, walls);

    const badgeBodies: Matter.Body[] = [];

    const spawnBadges = () => {
      skills.forEach((skill, i) => {
        const el = badgeRefs.current[i];
        const badgeWidth = el?.offsetWidth ?? skill.label.length * 7 + 20;
        const badgeHeight = el?.offsetHeight ?? 24;

        const x =
          Math.random() * Math.max(width - badgeWidth, 1) + badgeWidth / 2;
        const y = Math.random() * height * 0.35 + 20;

        const body = Bodies.rectangle(x, y, badgeWidth, badgeHeight, {
          restitution: 0.6,
          friction: 0.35,
          frictionAir: 0.012,
          density: 0.0018,
          chamfer: { radius: badgeHeight / 2 },
          label: skill.label,
        });

        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2,
          y: Math.random() * 1.5,
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

        badgeBodies.push(body);
      });

      Composite.add(world, badgeBodies);
    };

    requestAnimationFrame(() => requestAnimationFrame(spawnBadges));

    const mouse = Mouse.create(container);
    const mouseElement = mouse.element;
    const wheelHandler = (
      mouse as Matter.Mouse & { mousewheel?: EventListener }
    ).mousewheel;

    if (mouseElement && wheelHandler) {
      mouseElement.removeEventListener("mousewheel", wheelHandler);
      mouseElement.removeEventListener("DOMMouseScroll", wheelHandler);
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.12,
        damping: 0.05,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);

    let rafId = 0;
    const sync = () => {
      Engine.update(engine, 1000 / 60);

      badgeBodies.forEach((body, i) => {
        const el = badgeRefs.current[i];
        if (!el) return;

        const { x, y } = body.position;
        const angle = body.angle * (180 / Math.PI);
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`;
      });

      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      if (newW === width && newH === height) return;

      Composite.remove(world, walls);
      width = newW;
      height = newH;
      walls = createWalls(width, height);
      Composite.add(world, walls);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      Composite.clear(world, false, true);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="card relative h-full cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      {skills.map((skill, i) => (
        <span
          key={skill.label}
          ref={(el) => {
            badgeRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm will-change-transform"
          style={{
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
