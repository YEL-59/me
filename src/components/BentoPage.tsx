import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import CodeCard from "./cards/CodeCard";
import SkillsCard from "./cards/SkillsCard";
import ExperienceCard from "./cards/ExperienceCard";
import MapCard from "./cards/MapCard";
import PortfolioCard from "./cards/PortfolioCard";
import FilesCard from "./cards/FilesCard";

export default function BentoPage() {
  return (
    <div
      className="flex min-h-screen flex-col transition-colors duration-300"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <SiteHeader />

        <main className="flex-1">
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-8 md:p-8 xl:grid-cols-3">
            <div className="h-[248px]">
              <CodeCard />
            </div>
            <div className="h-[248px]">
              <SkillsCard />
            </div>
            <div className="h-[248px]">
              <ExperienceCard />
            </div>
            <div className="h-[248px]">
              <MapCard />
            </div>
            <div className="h-[248px]">
              <PortfolioCard />
            </div>
            <div className="h-[248px]">
              <FilesCard />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
