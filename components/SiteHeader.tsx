"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  cta?: boolean;
  external?: boolean; // ✅ 추가
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const menu: MenuItem[] = useMemo(
    () => [
      { label: "회사소개", href: "/about" },
      {
        label: "서비스",
        href: "/services/business-corp",
        children: [
          { label: "사업자·법인 컨설팅", href: "/services/business-corp" },
          { label: "금융소득·자산 컨설팅", href: "/services/finance-asset" },
          { label: "상속·증여 컨설팅", href: "/services/inheritance-gift" },
          { label: "부동산 세금 컨설팅", href: "/services/realestate-tax" },
          { label: "세무대행(선택)", href: "/services/tax-outsourcing" },
        ],
      },
      { label: "고객사례", href: "/cases" },
      { label: "공지사항", href: "/notice" },
      { label: "Q&A", href: "/qna" },
      { label: "FAQ", href: "/faq" },
      { label: "UNBOX", href: "/unbox", cta: true, external: true }, // ✅ 새탭
    ],
    []
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerCls = scrolled
    ? "fixed top-0 left-0 right-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur"
    : "fixed top-0 left-0 right-0 z-40 border-b border-transparent bg-transparent";

  const linkBase = "rounded-xl px-4 py-2 text-sm transition font-bold";

  const normalLink = scrolled
    ? "text-black/80 hover:bg-black/5 hover:text-black font-bold"
    : "text-white/80 hover:bg-white/15 hover:text-white font-bold";

  const activeLink = scrolled ? "bg-black/5 text-black" : "bg-white/10 text-white";

  const ctaLink = scrolled
    ? "ml-2 bg-black text-white font-semibold hover:bg-black/90 font-bold"
    : "ml-2 bg-white text-black font-semibold hover:bg-white/90 font-bold";

  const dropdownBox = scrolled
    ? "rounded-2xl border border-black/10 bg-white p-2 shadow-2xl"
    : "rounded-2xl border border-white/10 bg-[#0b1220] p-2 shadow-2xl";

  const dropdownItem = scrolled
    ? "block rounded-xl px-3 py-2 text-sm text-black/80 hover:bg-black/5"
    : "block rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/10";

  const mobileBtn = scrolled
    ? "rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black hover:bg-black/10"
    : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10";

  return (
    <>
      <Head>
        <title>SY 컨설팅</title>
      </Head>
      <header className={headerCls}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              alt="로고"
              src={scrolled ? "/images/logo_big.png" : "/images/logo_big2.png"}
              width={100}
              height={30}
              priority
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menu.map((item) => {
                const active = isActive(item.href);
                const hasChildren = !!item.children?.length;

                const externalProps = item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {};

                if (!hasChildren) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        {...externalProps}
                        className={[
                          linkBase,
                          item.cta ? ctaLink : normalLink,
                          active && !item.cta ? activeLink : "",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
                        active ? activeLink : normalLink,
                      ].join(" ")}
                    >
                      {item.label}
                      <span className={scrolled ? "text-xs text-black/50" : "text-xs text-white/60"}>
                        ▾
                      </span>
                    </Link>

                    <div
                      className={[
                        "absolute left-0 top-full w-72 pt-2",
                        "invisible opacity-0 translate-y-1 pointer-events-none",
                        "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
                        "transition",
                      ].join(" ")}
                    >
                      <div className={dropdownBox}>
                        <ul className="space-y-1">
                          {item.children!.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className={[
                                  dropdownItem,
                                  isActive(c.href) ? (scrolled ? "bg-black/5" : "bg-white/10") : "",
                                ].join(" ")}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 모바일 햄버거 */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className={mobileBtn}
              aria-label="Open menu"
            >
              메뉴
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 슬라이드 메뉴 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close overlay"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
              <div className="text-sm font-semibold text-black">MENU</div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-black/80 hover:bg-black/5"
              >
                닫기
              </button>
            </div>

            <nav className="px-2 py-3">
              <ul className="space-y-1">
                {menu.map((item) => {
                  const active = isActive(item.href);
                  const hasChildren = !!item.children?.length;

                  const externalProps = item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {};

                  if (!hasChildren) {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          {...externalProps}
                          onClick={() => {
                            // ✅ 새탭은 유지 + 모바일 패널은 닫기
                            setMobileOpen(false);
                          }}
                          className={[
                            "flex items-center justify-between rounded-xl px-3 py-3 text-sm",
                            item.cta ? "bg-black text-white font-semibold" : "hover:bg-black/5 text-black",
                            active && !item.cta ? "bg-black/5" : "",
                          ].join(" ")}
                        >
                          <span>{item.label}</span>
                          {item.cta && <span className="text-xs opacity-80">바로가기</span>}
                        </Link>
                      </li>
                    );
                  }

                  const opened = openGroup === item.href;

                  return (
                    <li key={item.href} className="rounded-xl">
                      <button
                        type="button"
                        onClick={() => setOpenGroup(opened ? null : item.href)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm",
                          active ? "bg-black/5 text-black" : "hover:bg-black/5 text-black",
                        ].join(" ")}
                      >
                        <span>{item.label}</span>
                        <span className="text-black/50">{opened ? "−" : "+"}</span>
                      </button>

                      {opened && (
                        <div className="mt-1 space-y-1 px-2 pb-2">
                          {item.children!.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setMobileOpen(false)}
                              className={[
                                "block rounded-lg px-3 py-2 text-sm text-black/80 hover:bg-black/5",
                                isActive(c.href) ? "bg-black/5" : "",
                              ].join(" ")}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
