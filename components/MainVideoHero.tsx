"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

type Props = {
    className?: string;
    heightClassName?: string;
};

export default function MainVideoHero({
    className = "",
    heightClassName = "h-screen",
}: Props) {
    const [mounted, setMounted] = useState(false);

    const videos = useMemo(
        () => [
            "/video/main01.mp4",
            "/video/main02.mp4",
            "/video/main03.mp4",
            "/video/main04.mp4",
        ],
        []
    );

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const stopAll = () => {
        videoRefs.current.forEach((v) => {
            if (!v) return;
            v.pause();
            try {
                v.currentTime = 0;
            } catch { }
        });
    };

    const playAt = async (index: number) => {
        const v = videoRefs.current[index];
        if (!v) return;

        v.muted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "true");
        v.setAttribute("webkit-playsinline", "true");

        try {
            await v.play();
        } catch {
            setTimeout(() => v.play().catch(() => { }), 150);
        }
    };

    useEffect(() => setMounted(true), []);

    // ✅ SSR mismatch 방지: mounted 전엔 단일 video만
    if (!mounted) {
        return (
            <section className={`relative w-full overflow-hidden ${heightClassName} ${className}`}>
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={videos[0]}
                    muted
                    playsInline
                    preload="auto"
                    autoPlay
                    loop
                />

                {/* ✅ 중앙 문구 */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
                    <p className="max-w-3xl text-balance text-2xl font-semibold leading-snug tracking-tight text-white drop-shadow sm:text-4xl">
                        나의 오늘을 지키고 가족을 보호하며 회사를 키워 사회에 기여합니다
                    </p>
                </div>

                {/* 가독성용 살짝 어둡게 (원치 않으면 삭제) */}
                <div className="pointer-events-none absolute inset-0 bg-black/25" />
            </section>
        );
    }

    return (
        <section className={`relative w-full overflow-hidden ${heightClassName} ${className}`}>
            <Swiper
                 // ✅ 드래그/스와이프 비활성화(핵심)
                allowTouchMove={false}

                // (선택) 마우스 드래그/커서도 스와이프처럼 동작하는 것 방지용
                simulateTouch={false}
                modules={[EffectFade, Autoplay]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                speed={900}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                onSwiper={(swiper) => {
                    stopAll();
                    playAt(swiper.realIndex || 0);
                }}
                onSlideChangeTransitionStart={(swiper) => {
                    const i = swiper.realIndex;
                    stopAll();
                    playAt(i);
                }}
                className="absolute inset-0 h-full"
            >
                {videos.map((src, idx) => (
                    <SwiperSlide key={src}>
                        <video
                            ref={(el) => {
                                videoRefs.current[idx] = el; // ✅ void 반환
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                            src={src}
                            muted
                            playsInline
                            preload="auto"
                            autoPlay
                            loop
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ✅ 중앙 문구 */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
  <div className="flex flex-col items-center gap-4">
    {/* 메인 2줄 문구 (모바일도 2줄 고정) */}
    <p className="text-center font-semibold leading-snug tracking-tight text-white drop-shadow text-lg sm:text-4xl">
      <span className="block whitespace-nowrap">
        나의 오늘을 지키고, 가족을 보호하며,
      </span>
      <span className="block whitespace-nowrap">
        회사를 키워, 사회에 기여합니다
      </span>
    </p>

    {/* 서브 문구 */}
    <p className="text-center text-xs sm:text-sm text-white/85 drop-shadow">
      사회에 남는 것은 <span className="font-semibold text-white">&apos;성과&apos;</span>가 아니라{" "}
      <span className="font-semibold text-white">&apos;신뢰&apos;</span>입니다
    </p>
  </div>
</div>

            {/* 가독성용 오버레이(원치 않으면 삭제) */}
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
        </section>
    );
}
