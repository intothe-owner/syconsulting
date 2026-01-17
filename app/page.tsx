import CustomConsultingSection from "@/components/CustomConsultingSection";
import MainVideoHero from "@/components/MainVideoHero";
import SiteFooter from "@/components/SiteFooter";
import StatsCounter from "@/components/StatsCounter";

export default function Home() {
  return (
    <div className="-mt-16">
      <MainVideoHero heightClassName="h-screen" />
      {/* 카운팅 섹션 */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 mb-10 w-full rounded border border-gray-200 p-5 shadow-sm md:shadow-lg lg:shadow-xl">
          <StatsCounter />
        </div>
      </section>

      {/* 맞춤형 컨설팅 섹션 (배경/영역은 풀폭, 내용은 6xl) */}
      <CustomConsultingSection />

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
