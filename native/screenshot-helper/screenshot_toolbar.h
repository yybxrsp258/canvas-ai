#pragma once
#include <filesystem>
#include <fstream>
#include <regex>

// Native projection of the canvas menu tokens in styles/variables.css.
// The capture window cannot host CSS; keep this painter independent of capture state.
namespace ScreenshotToolbar {
using namespace Gdiplus;
constexpr int Height = 50;
constexpr int Width = 400;

struct Palette {
  Color panel, text, muted, hover, border, secondary, track, activeTrack, activeThumb;
};

inline Color ReadTokenColor(const std::string& css, std::string token, int depth = 0) {
  std::smatch match;
  if (depth < 8 && std::regex_search(css, match, std::regex(token + R"(\s*:\s*([^;]+);)"))) {
    const std::string value = match[1];
    if (std::regex_search(value, match, std::regex(R"(var\((--[\w-]+)\))"))) {
      return ReadTokenColor(css, match[1], depth + 1);
    }
    if (std::regex_search(value, match, std::regex(R"(rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\))"))) {
      return Color(match[4].matched ? static_cast<BYTE>(std::stod(match[4]) * 255 + 0.5) : 255,
                   static_cast<BYTE>(std::stoi(match[1])), static_cast<BYTE>(std::stoi(match[2])), static_cast<BYTE>(std::stoi(match[3])));
    }
    if (std::regex_search(value, match, std::regex(R"(#([0-9a-fA-F]{6}))"))) {
      const auto rgb = std::stoul(match[1], nullptr, 16);
      return Color(255, (rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255);
    }
  }
  return Color::MakeARGB(255, GetRValue(GetSysColor(COLOR_WINDOWTEXT)),
                        GetGValue(GetSysColor(COLOR_WINDOWTEXT)), GetBValue(GetSysColor(COLOR_WINDOWTEXT)));
}

inline Palette ReadPalette(const std::wstring& path) {
  std::ifstream input{std::filesystem::path(path)};
  const std::string css((std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>());
  return {ReadTokenColor(css, "--surface-menu"), ReadTokenColor(css, "--text-primary"),
          ReadTokenColor(css, "--text-muted"), ReadTokenColor(css, "--fill-hover-strong"),
          ReadTokenColor(css, "--stroke-strong"), ReadTokenColor(css, "--text-secondary"),
          ReadTokenColor(css, "--fill-active"), ReadTokenColor(css, "--indigo-60"), ReadTokenColor(css, "--indigo-text")};
}

inline RECT ActionRect(const RECT& toolbar, int index) {
  const int stops[] = {0, 18, 36, 70, 100};
  const int width = toolbar.right - toolbar.left - 12;
  return {toolbar.left + 6 + width * stops[index] / 100, toolbar.top + 7,
          toolbar.left + 6 + width * stops[index + 1] / 100 - 2, toolbar.top + 43};
}

inline RECT RunRect(const RECT& toolbar) {
  return {toolbar.left + 10, toolbar.top + Height + 8, toolbar.right - 10, toolbar.top + Height + 42};
}

inline int HitTest(const RECT& toolbar, POINT point, bool expanded) {
  for (int index = 0; index < 4; ++index) {
    RECT button = ActionRect(toolbar, index);
    if (PtInRect(&button, point)) return index;
  }
  RECT run = RunRect(toolbar);
  return expanded && PtInRect(&run, point) ? 4 : -1;
}

inline void RoundedPath(GraphicsPath& path, RectF rect, REAL radius) {
  const REAL diameter = radius * 2;
  path.AddArc(rect.X, rect.Y, diameter, diameter, 180, 90);
  path.AddArc(rect.GetRight() - diameter, rect.Y, diameter, diameter, 270, 90);
  path.AddArc(rect.GetRight() - diameter, rect.GetBottom() - diameter, diameter, diameter, 0, 90);
  path.AddArc(rect.X, rect.GetBottom() - diameter, diameter, diameter, 90, 90);
  path.CloseFigure();
}

inline void FillRounded(Graphics& graphics, Brush& brush, RectF bounds, REAL radius) {
  GraphicsPath path;
  RoundedPath(path, bounds, radius);
  graphics.FillPath(&brush, &path);
}

inline void Icon(Graphics& graphics, int index, REAL x, REAL y, const Palette& palette) {
  Pen pen(palette.secondary, 1.2f);
  pen.SetStartCap(LineCapRound);
  pen.SetEndCap(LineCapRound);
  if (index == 0) {
    GraphicsPath path;
    RoundedPath(path, RectF(x + 1, y + 1, 13, 13), 2);
    graphics.DrawPath(&pen, &path);
    graphics.DrawLine(&pen, x + 4, y + 7.5f, x + 11, y + 7.5f);
    graphics.DrawLine(&pen, x + 7.5f, y + 4, x + 7.5f, y + 11);
  } else if (index == 1) {
    graphics.DrawEllipse(&pen, x + 1, y + 1, 13.0f, 13.0f);
    graphics.DrawLine(&pen, x + 5, y + 5, x + 10, y + 10);
    graphics.DrawLine(&pen, x + 10, y + 5, x + 5, y + 10);
  } else if (index == 2) {
    graphics.DrawLine(&pen, x + 2, y + 2, x + 13, y + 2);
    graphics.DrawLine(&pen, x + 7.5f, y + 2, x + 7.5f, y + 13);
    graphics.DrawLine(&pen, x + 4, y + 13, x + 11, y + 13);
  } else {
    graphics.DrawLine(&pen, x + 2, y + 13, x + 13, y + 13);
    graphics.DrawLine(&pen, x + 3, y + 10, x + 10, y + 3);
    graphics.DrawLine(&pen, x + 5, y + 12, x + 12, y + 5);
    graphics.DrawLine(&pen, x + 10, y + 3, x + 12, y + 5);
    graphics.DrawLine(&pen, x + 3, y + 10, x + 3, y + 12);
  }
}

inline void Paint(Graphics& graphics, const RECT& toolbar, bool expanded, bool immediate, int hovered, const Palette& palette) {
  graphics.SetSmoothingMode(SmoothingModeAntiAlias);
  SolidBrush panel(palette.panel), text(palette.text), muted(palette.muted), hover(palette.hover);
  Pen border(palette.border, 1);
  RectF bounds(static_cast<REAL>(toolbar.left) + 0.5f, static_cast<REAL>(toolbar.top) + 0.5f,
               static_cast<REAL>(toolbar.right - toolbar.left) - 1, static_cast<REAL>(toolbar.bottom - toolbar.top) - 1);
  GraphicsPath panelPath;
  RoundedPath(panelPath, bounds, 12);
  graphics.FillPath(&panel, &panelPath);
  graphics.DrawPath(&border, &panelPath);
  FontFamily family(L"Microsoft YaHei UI");
  Font font(&family, 13, FontStyleRegular, UnitPixel);
  StringFormat format(StringFormat::GenericTypographic());
  format.SetLineAlignment(StringAlignmentCenter);
  format.SetFormatFlags(format.GetFormatFlags() | StringFormatFlagsNoWrap);
  const wchar_t* labels[] = {L"确定", L"取消", L"反推提示词", L"高级设置"};
  for (int index = 0; index < 4; ++index) {
    RECT button = ActionRect(toolbar, index);
    RectF rect(static_cast<REAL>(button.left), static_cast<REAL>(button.top),
               static_cast<REAL>(button.right - button.left), static_cast<REAL>(button.bottom - button.top));
    if (hovered == index || (index == 3 && expanded)) FillRounded(graphics, hover, rect, 8);
    RectF measured;
    graphics.MeasureString(labels[index], -1, &font, PointF(0, 0), &format, &measured);
    const REAL contentWidth = 22.0f + measured.Width;
    const bool showIcon = rect.Width >= contentWidth + 4;
    const REAL x = rect.X + (rect.Width - (showIcon ? contentWidth : measured.Width)) / 2;
    if (showIcon) Icon(graphics, index, x, rect.Y + 10, palette);
    const REAL labelX = x + (showIcon ? 22 : 0);
    RectF label(labelX, rect.Y, rect.GetRight() - labelX, rect.Height);
    graphics.DrawString(labels[index], -1, &font, label, &format, &text);
  }
  if (!expanded) return;
  graphics.DrawLine(&border, toolbar.left + 10, toolbar.top + Height, toolbar.right - 10, toolbar.top + Height);
  RECT run = RunRect(toolbar);
  RectF row(static_cast<REAL>(run.left), static_cast<REAL>(run.top), static_cast<REAL>(run.right - run.left), 34);
  if (hovered == 4) FillRounded(graphics, hover, row, 8);
  RectF label(row.X + 8, row.Y, row.Width - 58, row.Height);
  graphics.DrawString(L"立即生成提示词", -1, &font, label, &format, &text);
  SolidBrush track(immediate ? palette.activeTrack : palette.track);
  SolidBrush thumb(immediate ? palette.activeThumb : palette.muted);
  const REAL switchX = row.GetRight() - 40, switchY = row.Y + 8;
  FillRounded(graphics, track, RectF(switchX, switchY, 32, 18), 9);
  graphics.FillEllipse(&thumb, switchX + (immediate ? 16 : 2), switchY + 2, 14.0f, 14.0f);
  Font hintFont(&family, 12, FontStyleRegular, UnitPixel);
  RectF hint(row.X + 8, row.GetBottom() + 2, row.Width - 16, 36);
  graphics.DrawString(L"关闭后仅创建截图和反推节点并加入画布", -1, &hintFont, hint, nullptr, &muted);
}
} // namespace ScreenshotToolbar
