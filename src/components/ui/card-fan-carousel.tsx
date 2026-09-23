"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Code, Download, Lock, Star } from "lucide-react";
import gsap from "gsap";

export interface CardItem {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  /** The project's own entry on the projects page. */
  detailHref: string;
  detailLabel: string;
  githubUrl?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  isClosedSource?: boolean;
  closedSourceLabel?: string;
  selectLabel?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const SOLO_BELOW = 640;

const isSolo = () => window.innerWidth < SOLO_BELOW;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border border-black/10 bg-white/70 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur cursor-pointer shrink-0 z-30 outline-none hover:border-accent hover:text-accent active:opacity-70 transition-colors duration-300";

function getGithubApiUrl(repoUrl: string) {
  try {
    const url = new URL(repoUrl);
    const [owner, repo] = url.pathname.replace(/^\/|\/$/g, "").split("/");
    if (!owner || !repo) return null;
    return `https://api.github.com/repos/${owner}/${repo}`;
  } catch {
    return null;
  }
}

function formatStars(count: number) {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(count < 10000 ? 1 : 0)}k`;
}

export default function SocialCards({ cards }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const initialIndex = 0;
  const [centerIndex, setCenterIndex] = useState(initialIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [starsByRepo, setStarsByRepo] = useState<Record<string, number>>({});

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const centerSlot = slotCount >> 1;

    for (let slot = 0; slot < slotCount; slot++) {
      map.set(((center + slot - centerSlot) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (totalCards < 2) return;
    setCenterIndex((prev) => {
      const next = direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards;
      setActiveIndex(next);
      return next;
    });
  }, [totalCards]);

  const selectCard = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setCenterIndex(index);
  }, [activeIndex]);

  useEffect(() => {
    const controller = new AbortController();
    const githubUrls = Array.from(new Set(cards.map((card) => card.githubUrl).filter(Boolean))) as string[];

    githubUrls.forEach(async (repoUrl) => {
      const apiUrl = getGithubApiUrl(repoUrl);
      if (!apiUrl) return;

      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json() as { stargazers_count?: number };
        // A zero says nothing worth the space it takes.
        if (typeof data.stargazers_count !== "number" || data.stargazers_count < 1) return;
        setStarsByRepo((prev) => ({ ...prev, [repoUrl]: data.stargazers_count }));
      } catch {
        // Keep the GitHub button visible even if the stars request is rate-limited.
      }
    });

    return () => controller.abort();
  }, [cards]);

  const renderActions = (card: CardItem, index: number) => {
    // Off-centre the card is half hidden, so a tap should bring it forward
    // rather than send you somewhere you cannot properly see.
    const guard = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (index !== activeIndex) {
        event.preventDefault();
        selectCard(index);
      }
    };

    return (
      <span className="project-fan-actions">
        <a className="project-fan-link" href={card.detailHref} onClick={guard}>
          {card.detailLabel}
          <ArrowRight aria-hidden="true" />
        </a>

        {card.githubUrl ? (
          <a
            className="project-fan-link project-fan-link--ghost"
            href={card.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={guard}
          >
            <Code aria-hidden="true" />
            GitHub
            {typeof starsByRepo[card.githubUrl] === "number" && (
              <span className="project-fan-stars">
                <Star aria-hidden="true" />
                {formatStars(starsByRepo[card.githubUrl])}
              </span>
            )}
          </a>
        ) : card.downloadUrl ? (
          <a
            className="project-fan-link project-fan-link--ghost"
            href={card.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={guard}
          >
            <Download aria-hidden="true" />
            {card.downloadLabel ?? "Download"}
          </a>
        ) : card.isClosedSource ? (
          <span className="project-fan-closed">
            <Lock aria-hidden="true" />
            {card.closedSourceLabel ?? "Closed source"}
          </span>
        ) : null}
      </span>
    );
  };

  // The fan is drawn in place and stays put: no entrance, no sliding when
  // the project changes, no spreading under the pointer.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const middleSlot = slotCount >> 1;

    const layout = () => {
      const solo = isSolo();
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hMult = getHeightMultiplier(window.innerWidth);

      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex);

        // Out of the fan, or beside the one card shown on a phone: hidden,
        // so it cannot be clicked or tabbed to where nobody can see it.
        if (slot === undefined || (solo && slot !== middleSlot)) {
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.86, autoAlpha: 0, zIndex: 0 });
          return;
        }

        if (solo) {
          gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, zIndex: 10 });
          return;
        }

        const { x, y, rot, scale, zIndex } = getSlotConfig(slotCount, slot);
        gsap.set(card, {
          x: `${x * mult}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          autoAlpha: 1,
          zIndex,
        });
      });
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  return (
    <section className="flex w-full flex-col items-center px-4 py-4 md:px-8 lg:py-8">
      <div className="flex w-full items-center justify-center">
        <div ref={containerRef} className="fan-layout relative flex w-full max-w-[80rem] items-center justify-center">
          {cards.map((card, index) => (
            <div
              key={card.title}
              role="button"
              tabIndex={0}
              className={`fan-card project-fan-card ${index === activeIndex ? "is-active" : ""}`}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={card.selectLabel ?? card.title}
              onClick={() => selectCard(index)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                selectCard(index);
              }}
            >
              <span className="project-fan-inner">
                <span className="project-fan-media" aria-hidden="true">
                  {card.imageSrc ? (
                    <img
                      className="project-fan-illustration"
                      src={card.imageSrc}
                      alt=""
                      width={420}
                      height={420}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="project-fan-emoji">{card.title.charAt(0).toUpperCase()}</span>
                  )}
                </span>
                <span className="project-fan-copy">
                  <span className="project-fan-title">{card.title}</span>
                  {renderActions(card, index)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {totalCards > 1 && (
        <div className="z-30 mt-4 flex items-center justify-center gap-4 md:mt-6">
          <button className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`} onClick={() => cycle("left")} aria-label="Previous project">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === activeIndex ? "scale-[1.3] bg-primary/70" : "bg-primary/15"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`} onClick={() => cycle("right")} aria-label="Next project">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </section>
  );
}
