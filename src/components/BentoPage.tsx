import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import BentoAmbientStrip from "./BentoAmbientStrip";
import BentoCardShell from "./BentoCardShell";
import CodeCard from "./cards/CodeCard";
import SkillsCard from "./cards/SkillsCard";
import ExperienceCard from "./cards/ExperienceCard";
import MapCard from "./cards/MapCard";
import PortfolioCard from "./cards/PortfolioCard";
import FilesCard from "./cards/FilesCard";

const bentoCards = [
  CodeCard,
  SkillsCard,
  ExperienceCard,
  MapCard,
  PortfolioCard,
  FilesCard,
] as const;

export default function BentoPage() {
  return (
    <div
      className="flex min-h-screen flex-col transition-colors duration-300"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-1 flex-col">
        <SiteHeader />

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {bentoCards.map((Card, index) => (
              <div key={index} className="h-[260px]">
                <BentoCardShell>
                  <Card />
                </BentoCardShell>
              </div>
            ))}
          </div>

          <BentoAmbientStrip />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
