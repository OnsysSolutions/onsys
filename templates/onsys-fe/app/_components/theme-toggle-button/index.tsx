"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/_components/ui/button";
import { cn } from "@/_lib/utils";

type AnimationVariant = "circle" | "circle-blur" | "gif" | "polygon";
type StartPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface ThemeToggleButtonProps {
  showLabel?: boolean;
  variant?: AnimationVariant;
  start?: StartPosition;
  className?: string;
}

export const ThemeToggleButton = ({
  showLabel = false,
  variant = "circle",
  start = "center",
  className,
}: ThemeToggleButtonProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Garante que o tema só é acessado após hidratação
  useEffect(() => setMounted(true), []);

  const handleClick = useCallback(() => {
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement("style");
    style.id = styleId;
    const positions = {
      center: "center",
      "top-left": "top left",
      "top-right": "top right",
      "bottom-left": "bottom left",
      "bottom-right": "bottom right",
    };

    let css = "";
    const cx = start === "center" ? "50" : start.includes("left") ? "0" : "100";
    const cy = start === "center" ? "50" : start.includes("top") ? "0" : "100";

    if (variant === "circle") {
      css = `
        @supports (view-transition-name: root) {
          ::view-transition-new(root) {
            animation: circle-expand 0.4s ease-out;
            transform-origin: ${positions[start]};
          }
          @keyframes circle-expand {
            from { clip-path: circle(0% at ${cx}% ${cy}%); }
            to { clip-path: circle(150% at ${cx}% ${cy}%); }
          }
        }
      `;
    }

    if (css) {
      style.textContent = css;
      document.head.appendChild(style);
      setTimeout(() => document.getElementById(styleId)?.remove(), 3000);
    }

    setTheme(theme === "light" ? "dark" : "light");
  }, [variant, start, theme, setTheme]);

  // 🧩 Evita hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={showLabel ? "default" : "icon"}
        className={cn(
          "relative overflow-hidden transition-all",
          showLabel && "gap-2",
          className,
        )}
        disabled
        aria-hidden="true"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all",
        showLabel && "gap-2",
        className,
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {showLabel && (
        <span className="text-sm">{theme === "light" ? "Light" : "Dark"}</span>
      )}
    </Button>
  );
};
