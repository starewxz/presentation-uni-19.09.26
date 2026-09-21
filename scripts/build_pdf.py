#!/usr/bin/env python3
"""
Builds the reading-script PDF from content/lecture-script.md.

Edit the markdown file, then run:
    python3 scripts/build_pdf.py

Markdown support is intentionally minimal:
  # / ##          -> title / section heading
  plain paragraph  -> justified body text
  - item          -> bullet list item
  **bold**        -> bold inline text
  > line          -> italic meta note (only used near the top)
  ---             -> stops parsing (everything after is project notes, not read aloud)
"""
import re
import sys
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable, ListFlowable, ListItem, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors

ROOT = Path(__file__).resolve().parent.parent
SRC_MD = ROOT / "content" / "lecture-script.md"
OUT_PDF = ROOT / "Тема-1-Пункт-1_текст-доповіді.pdf"

FONT_CANDIDATES = [
    "/Users/oleksandr/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/"
    "libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype/",
]


def register_fonts():
    for font_dir in FONT_CANDIDATES:
        p = Path(font_dir)
        if (p / "DejaVuSans.ttf").exists():
            pdfmetrics.registerFont(TTFont("DejaVu", str(p / "DejaVuSans.ttf")))
            pdfmetrics.registerFont(TTFont("DejaVu-Bold", str(p / "DejaVuSans-Bold.ttf")))
            pdfmetrics.registerFont(TTFont("DejaVu-Oblique", str(p / "DejaVuSans-Oblique.ttf")))
            return
    print("Could not find DejaVuSans fonts (needed for Cyrillic). Install them and update FONT_CANDIDATES.")
    sys.exit(1)


def md_inline(text: str) -> str:
    """Convert **bold** to reportlab <b> tags; escape raw & < >."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    return text


def main():
    register_fonts()

    BURGUNDY = colors.HexColor("#7c1d2e")
    INK = colors.HexColor("#1a1612")
    INK_MUTED = colors.HexColor("#4a4340")

    title_style = ParagraphStyle("Title", fontName="DejaVu-Bold", fontSize=19, leading=24, textColor=INK, spaceAfter=4)
    subtitle_style = ParagraphStyle("Subtitle", fontName="DejaVu-Bold", fontSize=13, leading=17, textColor=BURGUNDY, spaceAfter=14)
    meta_style = ParagraphStyle("Meta", fontName="DejaVu-Oblique", fontSize=9, leading=13, textColor=INK_MUTED, spaceAfter=10)
    h2_style = ParagraphStyle("H2", fontName="DejaVu-Bold", fontSize=13.5, leading=17, textColor=BURGUNDY, spaceBefore=18, spaceAfter=8)
    body_style = ParagraphStyle("Body", fontName="DejaVu", fontSize=10.5, leading=16, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8)
    bullet_style = ParagraphStyle("Bullet", fontName="DejaVu", fontSize=10.5, leading=15.5, textColor=INK, alignment=TA_JUSTIFY)
    bib_style = ParagraphStyle("Bib", fontName="DejaVu", fontSize=9.5, leading=14, textColor=INK, spaceAfter=4)

    raw = SRC_MD.read_text(encoding="utf-8")
    raw = raw.split("\n---\n")[0]  # drop the "how to regenerate" footer section
    lines = raw.splitlines()

    story = []
    title_lines = []
    i = 0
    # collect leading H1 lines as the title block
    while i < len(lines) and (lines[i].startswith("# ") or not lines[i].strip()):
        if lines[i].startswith("# "):
            title_lines.append(lines[i][2:].strip())
        i += 1

    if title_lines:
        story.append(Paragraph(md_inline(title_lines[0]), title_style))
        for extra in title_lines[1:]:
            story.append(Paragraph(md_inline(extra), subtitle_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=INK_MUTED, spaceAfter=14))

    bullet_buffer = []

    def flush_bullets():
        nonlocal bullet_buffer
        if bullet_buffer:
            story.append(ListFlowable(
                [ListItem(Paragraph(md_inline(b), bullet_style)) for b in bullet_buffer],
                bulletType="bullet", start="•", leftIndent=14, bulletFontSize=10, spaceBefore=2, spaceAfter=10,
            ))
            bullet_buffer = []

    for line in lines[i:]:
        s = line.strip()
        if not s:
            continue
        if s.startswith("> "):
            flush_bullets()
            story.append(Paragraph(md_inline(s[2:]), meta_style))
        elif s.startswith("## "):
            flush_bullets()
            story.append(Paragraph(md_inline(s[3:]), h2_style))
        elif s.startswith("- "):
            bullet_buffer.append(s[2:])
        elif re.match(r"^\d+\.\s", s):
            flush_bullets()
            story.append(Paragraph(md_inline(s), bib_style))
        else:
            flush_bullets()
            story.append(Paragraph(md_inline(s), body_style))

    flush_bullets()
    story.append(Spacer(1, 16))

    doc = SimpleDocTemplate(
        str(OUT_PDF), pagesize=A4,
        leftMargin=22 * mm, rightMargin=22 * mm, topMargin=18 * mm, bottomMargin=18 * mm,
        title="Правління Ярославичів — текст доповіді",
    )
    doc.build(story)
    print(f"saved: {OUT_PDF}")


if __name__ == "__main__":
    main()
