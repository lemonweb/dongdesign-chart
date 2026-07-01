from PIL import Image, ImageFilter, ImageChops, ImageDraw
import math

src = "/var/folders/dc/ws8m4t553kb7hzwrb9pvvj3w0000gp/T/zero/attachments/image-1781158767002-73oqb6.png"
out = "/Users/wangfei35/Documents/JD-Design-AI-Efficiency/JD-Design-AI-Efficiency/knowledge-base/dongdesign-chart/blue-purple-rocket-icon.png"
size = 1024

img = Image.open(src).convert('RGBA')
gray = img.convert('L')
mask_src = gray.point(lambda p: 255 if p < 128 else 0, 'L')
scale = min(size / img.width, size / img.height) * 0.92
nw, nh = int(img.width * scale), int(img.height * scale)
mask_resized = mask_src.resize((nw, nh), Image.Resampling.LANCZOS)
mask = Image.new('L', (size, size), 0)
mask.paste(mask_resized, ((size - nw) // 2, (size - nh) // 2))
mask = mask.filter(ImageFilter.GaussianBlur(0.6))

soft = mask.filter(ImageFilter.GaussianBlur(10))
inner = mask.filter(ImageFilter.MinFilter(31)).filter(ImageFilter.GaussianBlur(4))
outer_edge = ImageChops.subtract(mask, inner).filter(ImageFilter.GaussianBlur(1.2))

base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
pix = base.load()
for y in range(size):
    ty = y / (size - 1)
    for x in range(size):
        tx = x / (size - 1)
        t = max(0, min(1, 0.62 * ty + 0.38 * tx))
        if t < 0.48:
            k = t / 0.48
            c0 = (44, 194, 255)
            c1 = (107, 83, 255)
        else:
            k = (t - 0.48) / 0.52
            c0 = (107, 83, 255)
            c1 = (187, 55, 255)
        r = int(c0[0] * (1 - k) + c1[0] * k)
        g = int(c0[1] * (1 - k) + c1[1] * k)
        b = int(c0[2] * (1 - k) + c1[2] * k)
        d = math.hypot((tx - 0.50) * 1.25, (ty - 0.43) * 1.1)
        glow = max(0, 1 - d * 1.55)
        pix[x, y] = (min(255, int(r + 48 * glow)), min(255, int(g + 34 * glow)), min(255, int(b + 60 * glow)), 218)
base.putalpha(mask.point(lambda p: int(p * 0.84)))

bottom = Image.new('RGBA', (size, size), (0, 0, 0, 0))
db = ImageDraw.Draw(bottom)
for i in range(170):
    db.rectangle([0, int(size * 0.58) + i, size, int(size * 0.58) + i + 1], fill=(83, 33, 220, int(75 * (1 - i / 170))))
bottom.putalpha(ImageChops.multiply(bottom.getchannel('A'), mask))

rim_cyan = Image.new('RGBA', (size, size), (40, 220, 255, 0))
rim_cyan.putalpha(outer_edge.point(lambda p: int(p * 0.78)))
rim_violet = Image.new('RGBA', (size, size), (210, 78, 255, 0))
rim_shift = ImageChops.offset(outer_edge, 10, 14).filter(ImageFilter.GaussianBlur(0.8))
rim_violet.putalpha(rim_shift.point(lambda p: int(p * 0.62)))
white_rim = Image.new('RGBA', (size, size), (255, 255, 255, 0))
white_rim.putalpha(outer_edge.point(lambda p: int(p * 0.34)))

inner_glow = Image.new('RGBA', (size, size), (255, 255, 255, 0))
ig = Image.new('L', (size, size), 0)
dig = ImageDraw.Draw(ig)
dig.ellipse([int(size * 0.28), int(size * 0.16), int(size * 0.68), int(size * 0.62)], fill=105)
ig = ig.filter(ImageFilter.GaussianBlur(80))
ig = ImageChops.multiply(ig, mask)
inner_glow.putalpha(ig)

high = Image.new('RGBA', (size, size), (255, 255, 255, 0))
d = ImageDraw.Draw(high)
d.arc([260, 130, 690, 650], 205, 292, fill=(255, 255, 255, 138), width=20)
d.arc([298, 166, 650, 594], 208, 282, fill=(120, 226, 255, 88), width=10)
d.ellipse([442, 127, 520, 163], fill=(255, 255, 255, 84))
d.arc([432, 222, 768, 765], 304, 28, fill=(255, 255, 255, 74), width=13)
d.rounded_rectangle([260, 765, 762, 794], radius=15, fill=(255, 255, 255, 58))
d.arc([310, 714, 714, 1010], 54, 126, fill=(210, 92, 255, 112), width=18)
d.rounded_rectangle([205, 650, 817, 684], radius=10, fill=(91, 225, 255, 46))
high.putalpha(ImageChops.multiply(high.getchannel('A'), mask))

window = Image.new('RGBA', (size, size), (0, 0, 0, 0))
dw = ImageDraw.Draw(window)
cx = (221 / img.width) * nw + (size - nw) // 2
cy = (177 / img.height) * nh + (size - nh) // 2
rr = (34 / img.width) * nw
dw.ellipse([cx - rr * 1.08, cy - rr * 1.08, cx + rr * 1.08, cy + rr * 1.08], outline=(255, 255, 255, 170), width=max(8, int(rr * 0.16)))
dw.arc([cx - rr * 1.16, cy - rr * 1.16, cx + rr * 1.16, cy + rr * 1.16], 205, 335, fill=(64, 226, 255, 165), width=max(7, int(rr * 0.12)))
dw.arc([cx - rr * 1.22, cy - rr * 1.22, cx + rr * 1.22, cy + rr * 1.22], 20, 150, fill=(210, 90, 255, 125), width=max(6, int(rr * 0.10)))
hole = Image.new('L', (size, size), 0)
dh = ImageDraw.Draw(hole)
dh.ellipse([cx - rr * 0.90, cy - rr * 0.90, cx + rr * 0.90, cy + rr * 0.90], fill=255)
hole = hole.filter(ImageFilter.GaussianBlur(0.8))

shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
shadow_alpha = ImageChops.offset(mask.filter(ImageFilter.GaussianBlur(26)).point(lambda p: int(p * 0.18)), 0, 22)
shadow.putalpha(shadow_alpha)

out_img = Image.alpha_composite(shadow, base)
for layer in [bottom, rim_cyan, rim_violet, white_rim, inner_glow, high, window]:
    out_img = Image.alpha_composite(out_img, layer)
alpha = ImageChops.subtract(out_img.getchannel('A'), hole.point(lambda p: int(p * 0.96)))
out_img.putalpha(alpha)
out_img = Image.alpha_composite(out_img, window)

spark = Image.new('RGBA', (size, size), (0, 0, 0, 0))
ds = ImageDraw.Draw(spark)
for x, y, r, a in [(344, 258, 6, 125), (666, 404, 5, 90), (703, 636, 4, 86), (302, 690, 4, 70)]:
    ds.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, a))
spark.putalpha(ImageChops.multiply(spark.getchannel('A'), mask))
out_img = Image.alpha_composite(out_img, spark)

out_img.save(out)
print(out)
