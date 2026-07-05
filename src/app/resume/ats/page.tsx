import PageShell from "@/components/pages/PageShell";
import Link from "next/link";

export default function AtsResumePage() {
  return (
    <PageShell
      title="ATS Resume"
      subtitle="Md. Tofayel Islam — plain-text optimized for applicant tracking systems."
      accent="#8b5cf6"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href="/resume/resume-ats.tex"
          download
          className="rounded-lg border px-4 py-2 text-xs transition-colors hover:text-violet-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          Download .tex
        </a>
        <Link
          href="/resume"
          className="rounded-lg border px-4 py-2 text-xs transition-colors hover:text-violet-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          ← Resume hub
        </Link>
      </div>

      <article
        className="resume-ats rounded-2xl border p-6 md:p-8"
        style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
      >
        <header className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <h1 className="text-xl font-bold">Md. Tofayel Islam</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            tofayeltuhin143@gmail.com · +8801708901418
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            tofayel.vercel.app · github.com/YEL-59
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Summary</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Frontend Developer with 2+ years of experience building scalable web applications using React, Next.js, TypeScript, Redux, Tailwind CSS, ShadCN UI.</li>
            <li>Strong background in state management, API integration, and responsive design.</li>
            <li>Hands-on experience with AI-powered projects including resume generation, cover letter writing, and goal tracking platforms.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Education</h2>
          <div className="mt-2 text-sm">
            <p className="font-semibold">Daffodil International University</p>
            <p style={{ color: "var(--text-secondary)" }}>B.Sc. in Computer Science and Engineering — Savar, Dhaka</p>
            <p style={{ color: "var(--text-tertiary)" }}>Aug 2018 – Jul 2023</p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Experience</h2>
          <div className="mt-3 space-y-4 text-sm">
            <div>
              <p className="font-semibold">Frontend Developer — Softvence</p>
              <p style={{ color: "var(--text-secondary)" }}>React Developer (Full-Time) · Dhaka, Bangladesh</p>
              <p style={{ color: "var(--text-tertiary)" }}>Nov 2024 – Present</p>
              <ul className="mt-2 list-disc space-y-1 pl-5" style={{ color: "var(--text-secondary)" }}>
                <li>Developed and maintained scalable React applications using modern frontend tools.</li>
                <li>Collaborated with backend and design teams to deliver responsive user interfaces.</li>
                <li>Integrated APIs and implemented global state management with Redux Toolkit and React Query.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Frontend Developer — Amromed LLC</p>
              <p style={{ color: "var(--text-secondary)" }}>React Developer (Full-Time) · Dhaka, Bangladesh</p>
              <p style={{ color: "var(--text-tertiary)" }}>Apr 2023 – Sep 2024</p>
              <ul className="mt-2 list-disc space-y-1 pl-5" style={{ color: "var(--text-secondary)" }}>
                <li>Delivered production-grade React applications ensuring performance and scalability.</li>
                <li>Built reusable components and optimized frontend workflows.</li>
                <li>Integrated REST APIs and applied TypeScript for type safety.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Projects</h2>
          <div className="mt-3 space-y-4 text-sm">
            <div>
              <p className="font-semibold">Karially.com</p>
              <p style={{ color: "var(--text-tertiary)" }}>React, Next.js, TypeScript, Tailwind, ShadCN, Node.js, AI APIs</p>
              <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: "var(--text-secondary)" }}>
                <li>AI-powered platform for Resume & Cover Letter generation, and Career Goal Tracking.</li>
                <li>Modern dashboard with personalized AI recommendations.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">StudentIA</p>
              <p style={{ color: "var(--text-tertiary)" }}>React, Chart.js, Tailwind CSS</p>
              <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: "var(--text-secondary)" }}>
                <li>Dynamic admin dashboard with real-time data visualization and CRUD support.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Primeholiday</p>
              <p style={{ color: "var(--text-tertiary)" }}>React, Tailwind CSS, React Query, Node.js</p>
              <ul className="mt-1 list-disc space-y-1 pl-5" style={{ color: "var(--text-secondary)" }}>
                <li>Platform to explore, create, and manage holiday packages.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Technical Skills</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li><strong>Languages:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL</li>
            <li><strong>Frameworks:</strong> React, Next.js, Redux, Tailwind CSS, ShadCN UI</li>
            <li><strong>Tools:</strong> Git, GitHub, Vite, Webpack, Figma, VS Code</li>
            <li><strong>Other:</strong> REST APIs, Responsive Design, React Query, React Hook Form, Zod</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Programming Profiles</h2>
          <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>LeetCode: leetcode.com/YEL-59</li>
            <li>HackerRank: hackerrank.com/YEL_59</li>
            <li>Beecrowd: beecrowd.com.br/judge/en/profile/306160</li>
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
