import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)));
mkdirSync(root, { recursive: true });

function magick(args) {
  try {
    execFileSync("magick", args, { stdio: "inherit" });
  } catch {
    execFileSync("convert", args, { stdio: "inherit" });
  }
}

function card({ out, w, h, bg, ink, muted, title, subtitle }) {
  const path = join(root, out);
  magick([
    "-size",
    `${w}x${h}`,
    `xc:${bg}`,
    "-fill",
    ink,
    "-font",
    "DejaVu-Sans-Bold",
    "-pointsize",
    String(Math.round(w / 18)),
    "-gravity",
    "center",
    "-annotate",
    `+0-${Math.round(h * 0.06)}`,
    title,
    "-fill",
    muted,
    "-font",
    "DejaVu-Sans",
    "-pointsize",
    String(Math.round(w / 40)),
    "-annotate",
    `+0+${Math.round(h * 0.08)}`,
    subtitle,
    path,
  ]);
  console.log("wrote", path);
}

card({
  out: "readme-light.png",
  w: 2560,
  h: 1280,
  bg: "#f4f7fb",
  ink: "#1a2332",
  muted: "#3d5a73",
  title: "next-storyblok",
  subtitle: "Next.js App Router + Storyblok · marketing-site ownership",
});

card({
  out: "readme-dark.png",
  w: 2560,
  h: 1280,
  bg: "#121820",
  ink: "#e8eef5",
  muted: "#8aa4bc",
  title: "next-storyblok",
  subtitle: "Next.js App Router + Storyblok · marketing-site ownership",
});

card({
  out: "social.png",
  w: 1280,
  h: 640,
  bg: "#f4f7fb",
  ink: "#1a2332",
  muted: "#3d5a73",
  title: "next-storyblok",
  subtitle: "Headless marketing site demo",
});

card({
  out: "og.png",
  w: 1200,
  h: 630,
  bg: "#f4f7fb",
  ink: "#1a2332",
  muted: "#3d5a73",
  title: "next-storyblok",
  subtitle: "Next.js + Storyblok portfolio demo",
});
