"""生成应用图标（多尺寸 .ico）。

图形为定稿的"频谱花瓣 X"：4 片大花瓣撑出 X 四臂，4 片中花瓣填空隙，
8 片小花瓣做内圈，中心一点花蕊。小尺寸（<=32）自动简化为 4 大瓣 + 花蕊，
保证任务栏小图标仍可辨识。不使用原版素材。
"""
import math
import os
import struct

from PIL import Image, ImageDraw

CENTER = 128.0
# 花瓣轮廓（与 images/favicon.svg 的 xPetal 一致），采样两条三次贝塞尔
_PETAL_BEZIERS = [
    ((128, 128), (104, 100), (100, 62), (128, 30)),
    ((128, 30), (156, 62), (152, 100), (128, 128)),
]

BIG = [(45, "#4F50F3"), (135, "#F65391"), (225, "#FF7657"), (315, "#0D50FF")]
MEDIUM = [(0, "#2E50F6"), (90, "#A84DCE"), (180, "#FB6474"), (270, "#FDB73F")]
TINY = [
    (22.5, "#6E7BFF"), (67.5, "#9A6CF0"), (112.5, "#E070C0"), (157.5, "#FF8FA3"),
    (202.5, "#FF9A76"), (247.5, "#FFC069"), (292.5, "#FFD37A"), (337.5, "#5B8BFF"),
]


def _bezier(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    )


def _petal_points():
    pts = []
    for bez in _PETAL_BEZIERS:
        steps = 24
        for i in range(steps + 1):
            pts.append(_bezier(*bez, i / steps))
    return pts


_PETAL = _petal_points()


def _hex(rgb):
    rgb = rgb.lstrip("#")
    return tuple(int(rgb[i:i + 2], 16) for i in (0, 2, 4))


def _transform(pt, angle_deg, scale):
    a = math.radians(angle_deg)
    dx = (pt[0] - CENTER) * scale
    dy = (pt[1] - CENTER) * scale
    return (
        CENTER + dx * math.cos(a) - dy * math.sin(a),
        CENTER + dx * math.sin(a) + dy * math.cos(a),
    )


def _draw_petal(draw, k, angle_deg, scale, color, alpha=255):
    pts = [_transform(p, angle_deg, scale) for p in _PETAL]
    draw.polygon([(x * k, y * k) for x, y in pts], fill=(*_hex(color), alpha))


def render(size: int, detail: str = "full") -> Image.Image:
    ss = 4
    S = size * ss
    k = S / 256.0
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if detail != "big":
        for angle, color in MEDIUM:
            _draw_petal(draw, k, angle, 0.68, color, alpha=235)
    for angle, color in BIG:
        _draw_petal(draw, k, angle, 1.0, color)
    if detail == "full":
        for angle, color in TINY:
            _draw_petal(draw, k, angle, 0.38, color)

    r = 16 * k
    cx = cy = CENTER * k
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*_hex("#A84DCE"), 255))
    draw.ellipse([cx - r * .8, cy - r * .8, cx + r * .8, cy + r * .8], fill=(*_hex("#F65391"), 255))
    draw.ellipse([cx - r * .4, cy - r * .4, cx + r * .4, cy + r * .4], fill=(255, 255, 255, 255))

    return img.resize((size, size), Image.LANCZOS)


def _ico_entry(img: Image.Image) -> bytes:
    w, h = img.size
    px = img.load()
    rows = bytearray()
    for y in range(h - 1, -1, -1):
        for x in range(w):
            r, g, b, a = px[x, y]
            rows += struct.pack("<BBBB", b, g, r, a)
    mask_row = ((w + 31) // 32) * 4
    rows += b"\x00" * (mask_row * h)
    header = struct.pack("<IiiHHIIiiII", 40, w, h * 2, 1, 32, 0, len(rows), 0, 0, 0, 0)
    return header + bytes(rows)


def write_ico(path: str, images: list[Image.Image]) -> None:
    entries = [_ico_entry(im) for im in images]
    offset = 6 + 16 * len(images)
    out = bytearray(struct.pack("<HHH", 0, 1, len(images)))
    for im, data in zip(images, entries):
        w = im.size[0] % 256
        h = im.size[1] % 256
        out += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    for data in entries:
        out += data
    with open(path, "wb") as fh:
        fh.write(bytes(out))


def main() -> None:
    out = "build/app-icon.ico"
    os.makedirs(os.path.dirname(out), exist_ok=True)

    sizes = [256, 128, 64, 48, 32, 24, 16]
    images = [render(s, detail="full" if s >= 24 else "mid") for s in sizes]
    write_ico(out, images)
    print(f"已生成 {out}（{', '.join(str(s) for s in sizes)}），{os.path.getsize(out)} 字节")

    preview = "build/app-icon-preview.png"
    render(256).save(preview)
    print(f"预览图: {preview}")


if __name__ == "__main__":
    main()
