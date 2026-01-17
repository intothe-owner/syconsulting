"use client";

import SiteFooter from "@/components/SiteFooter";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react"; // ✅ 추가
type FaqItem = {
  title: string;
  summary: string;
  details: string[];
};

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900 md:text-lg">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600 md:text-[15px]">
                  {item.summary}
                </p>
              </div>

              {/* ✅ 아이콘으로 변경 */}
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-slate-700",
                  isOpen ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white",
                ].join(" ")}
                aria-hidden="true"
              >
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="border-t border-slate-100"
                >
                  <div className="px-5 py-4 md:px-6">
                    <ul className="space-y-2 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                      {item.details.map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                          <span className="min-w-0">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function Case() {
  const faqItems: FaqItem[] = useMemo(
    () => [
      {
        title: "개인사업자의 법인 전환, 세금이 정말 줄어들까요?",
        summary:
          "매출 증가로 소득세 부담이 커졌을 때, 법인 전환이 ‘무조건’ 정답은 아닙니다. 구조를 먼저 설계합니다.",
        details: [
          "개인사업자 소득세 구간과 법인세·배당/급여 구조를 비교해 유불리 판단",
          "대표 급여/상여/배당 비율을 설계해 ‘총세부담’을 최적화",
          "전환 과정에서 발생 가능한 양도·취득 관련 세무 이슈 사전 점검",
          "관리비용(4대보험, 회계/세무, 법인운영)까지 포함해 의사결정",
        ],
      },
      {
        title: "소득 분산(가족 급여/사업구조)로 종합소득세를 줄일 수 있나요?",
        summary:
          "배우자/가족이 실질적으로 함께 일하는 경우, 합법적인 소득 분산 설계로 부담을 낮출 수 있습니다.",
        details: [
          "가족 인건비(급여) 인정 요건과 증빙(근로계약, 업무기록, 지급증빙) 설계",
          "업종/사업형태에 맞는 비용처리 구조를 점검해 과세표준 최적화",
          "필요 시 사업자 구조(공동사업·법인화 등)까지 단계적으로 검토",
          "세무 리스크(부당행위, 인정상여 등) 방지 포인트까지 함께 안내",
        ],
      },
      {
        title: "대표 퇴직금, 7년 뒤 ‘적정’하게 받으려면 무엇을 준비해야 하나요?",
        summary:
          "퇴직금은 ‘마지막에 계산’이 아니라 ‘지금부터 설계’해야 절세와 안전성을 동시에 챙깁니다.",
        details: [
          "임원퇴직금 규정/정관/이사회 의사록 등 필수 요건 정비",
          "퇴직금 산정 방식과 급여 구조를 함께 점검(과다/과소 리스크 방지)",
          "퇴직소득 분리과세 효과를 최대화하는 지급 타이밍 검토",
          "세무조사 포인트(과다퇴직금, 손금불산입 등) 사전 방어 설계",
        ],
      },
      {
        title: "이자·배당 금융소득이 커지면(2천만 원↑) 절세 방법이 있나요?",
        summary:
          "금융소득 종합과세 구간에 들어가면 세율뿐 아니라 건강보험료까지 영향을 줄 수 있어요.",
        details: [
          "금융소득 규모·소득구성에 따라 종합과세 vs 분리과세 전략 검토",
          "가족 단위 자산 배분(합법적 분산)과 상품 구성 점검",
          "보험/연금/절세 계좌 등 활용 가능 범위를 케이스별로 제시",
          "장기적으로 상속·증여 플랜과 연결해 ‘세금의 흐름’을 관리",
        ],
      },
      {
        title: "사전 증여로 상속세를 줄이고 싶습니다. 언제/얼마나가 좋을까요?",
        summary:
          "상속 직전이 아니라 ‘기간과 분산’이 핵심입니다. 가족 상황에 맞춰 플랜을 만듭니다.",
        details: [
          "증여 공제, 과세표준 구간을 고려해 ‘분할 증여’ 설계",
          "부동산/현금/금융자산 등 자산별 세금·리스크 비교",
          "향후 상속까지 연결한 로드맵(10년 단위 합산 등)으로 최적화",
          "가족 간 분쟁을 줄이는 문서화(메모/합의서) 가이드 제공",
        ],
      },
      {
        title: "가업승계 주식 증여세 과세특례, 우리 회사도 가능할까요?",
        summary:
          "요건 충족 여부가 핵심입니다. 가능하다면 세부담을 크게 낮출 수 있는 제도입니다.",
        details: [
          "중소·중견 요건, 지분/업력/업종 요건 등 적합성 사전 진단",
          "사후관리(고용유지·업종유지 등) 리스크를 함께 설계",
          "승계 후 지배구조/의결권/배당 전략까지 연동해 안정화",
          "세무서 대응에 필요한 자료 체계(평가/증빙)까지 준비",
        ],
      },
      {
        title: "가업상속공제와 유류분(가족 분쟁) 이슈, 함께 고려해야 하나요?",
        summary:
          "공제만 보고 가면 분쟁으로 이어질 수 있습니다. ‘절세 + 가족 합의’가 동시에 필요합니다.",
        details: [
          "가업상속공제 요건 및 사후관리 리스크 점검",
          "유류분 분쟁 가능성을 사전에 진단하고 대응 시나리오 준비",
          "지분 구조/유언/사전증여/보험 등을 조합해 안정화",
          "가업의 지속 가능성(경영권/현금흐름)까지 함께 설계",
        ],
      },
      {
        title: "세대분할 증여(자녀+손주)로 절세가 되나요?",
        summary:
          "같은 금액이라도 ‘누구에게’ ‘어떻게 나누어’ 주느냐에 따라 세금이 달라집니다.",
        details: [
          "세대별 공제·세율 구조를 활용한 분산 전략 검토",
          "손주 증여 시 할증 등 체크포인트를 반영해 시뮬레이션",
          "교육비/생활비/주거지원 등 목적별 플랜 구성",
          "가족 관계/분쟁 가능성까지 고려한 실행 순서 제안",
        ],
      },
      {
        title: "특정법인·초과배당 이슈, 배당하면 증여로 보일 수도 있나요?",
        summary:
          "배당 설계가 잘못되면 의도치 않게 증여세 문제가 생길 수 있어요. 구조 점검이 필요합니다.",
        details: [
          "초과배당/특정법인 규정에 따른 리스크 사전 진단",
          "주주구성·배당정책을 정리해 안전한 배당 설계",
          "가족주주/임원주주 등 관계인 거래 이슈 점검",
          "세무 리스크 최소화를 위한 문서화(이사회/배당근거) 지원",
        ],
      },
      {
        title: "장애인 보험금 비과세, 어떤 방식으로 준비해야 하나요?",
        summary:
          "요건을 정확히 맞추면 절세 효과가 큽니다. 다만 설계·문서가 핵심입니다.",
        details: [
          "비과세 요건(피보험자/수익자/보험계약 구조 등) 체크",
          "가족 상황에 맞는 보장 설계 및 실행 절차 정리",
          "증여·상속 플랜과 연결해 ‘현금흐름’ 확보 전략 구성",
          "추후 분쟁 방지를 위한 증빙/서류 관리 가이드 제공",
        ],
      },
      {
        title: "상속·증여재산 평가는 어떻게 하느냐에 따라 세금이 달라지나요?",
        summary:
          "평가 방식은 세금의 ‘기준점’입니다. 부동산·비상장주식 등은 특히 중요합니다.",
        details: [
          "재산 유형별 평가 기준(부동산/주식/사업체 등) 정리",
          "합법 범위 내에서 평가 리스크를 낮추는 접근 검토",
          "사전 평가 시뮬레이션으로 예상 세액과 대안을 제시",
          "세무서 소명에 필요한 근거자료 체계까지 함께 준비",
        ],
      },
      {
        title: "증여 먼저? 양도(매매) 먼저? 순서에 따라 결과가 달라질까요?",
        summary:
          "같은 자산이라도 ‘순서’에 따라 양도세·증여세가 달라질 수 있습니다.",
        details: [
          "자산 유형과 보유기간, 취득가/시가를 기반으로 시뮬레이션",
          "증여 후 양도 vs 양도 후 증여의 장단점 비교",
          "가족 간 자금출처/취득자금 이슈까지 함께 점검",
          "실행 순서와 타이밍(연도 분산 등)까지 로드맵 제시",
        ],
      },
      {
        title: "법인으로 부동산을 매입하면 유리한가요?",
        summary:
          "법인 매입은 ‘절세’만 보고 접근하면 위험합니다. 취득·보유·처분까지 전 과정 비교가 필요합니다.",
        details: [
          "취득세/재산세/종부세/법인세 등 전 과정 세부담 비교",
          "임대/업무용 사용 등 목적에 맞는 운영 구조 설계",
          "대표 개인 자산과의 ‘분리’가 필요한지 전략적으로 판단",
          "처분 시 세금(양도 시점)까지 포함한 종합 시뮬레이션 제공",
        ],
      },
      {
        title: "1세대 2주택, 세금 폭탄 피하려면 어떻게 해야 하나요?",
        summary:
          "요건(거주/보유기간/일시적 2주택 등)에 따라 결과가 크게 달라집니다.",
        details: [
          "일시적 2주택 요건 충족 여부 및 처분 기한 체크",
          "거주·보유기간 요건을 기준으로 리스크 진단",
          "매도/증여/임대 등 선택지별 세부담 비교",
          "자금계획과 가족 계획까지 고려한 실행 전략 제시",
        ],
      },
      {
        title: "다주택자라면 ‘어떤 집부터’ 파는 게 유리할까요?",
        summary:
          "매도 순서를 잘 잡으면 세부담을 줄일 수 있습니다. 보유기간/수익/세율을 동시에 봅니다.",
        details: [
          "주택별 취득가·시가·보유기간 기준으로 매도 우선순위 설정",
          "양도세 중과/비과세 요건을 고려한 시나리오 비교",
          "임대/증여/법인전환 등 대안까지 함께 검토",
          "연도 분산, 가족 단위 자산 재배치 전략 제안",
        ],
      },
    ],
    []
  );

  return (
    <div className="-mt-16">
      <section className="relative w-full overflow-hidden bg-[url('/images/notes.jpg')] bg-cover bg-center py-14 md:h-[400px] md:py-0">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4 md:gap-10">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            고객 사례
          </h1>
        </div>
      </section>

      {/* ✅ 컨텐츠 */}
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold text-slate-900 md:text-base">
            실제 상담에서 가장 많이 나오는 질문을 정리했습니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-[15px]">
            케이스마다 정답은 다릅니다. 아래 사례를 참고하시고, 현재 상황(소득/자산/가족
            구성/사업 형태)에 맞춰 시뮬레이션이 필요하시면 상담으로 연결해드릴게요.
          </p>
        </div>

        <FaqAccordion items={faqItems} />
      </div>

      <SiteFooter
        companyName="SY 컨설팅"
        infoLine="사업자등록번호 000-00-00000 | 대표 OOO | 서울시 OO구 OO로 00 | 02-000-0000 | Email: hello@sy.co.kr"
      />
    </div>
  );
}
