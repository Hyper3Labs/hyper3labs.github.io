"""Generate Hyper3Labs favicon candidates and production icon assets.

The source geometry is a Poincare disk: geodesics are either diameters or
circles orthogonal to the disk boundary. The generator writes three candidate
preview sets for evaluation, then exports the selected candidate to the app and
manifest icon paths used by Next.js.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = ROOT / "logo_workspace" / "variants" / "favicon-options" / "generated"
SELECTED_VARIANT_ID = "e-monogram"

VIEWBOX = 64.0
SUPERSAMPLE = 4
FIELD_RADIUS_RATIO = 12.0 / 64.0
DISK_CENTER = (32.0, 32.0)
DISK_RADIUS = 24.0
TAU = math.tau

BLACK = (10, 10, 10, 255)
WHITE = (255, 255, 255, 255)
GRAY_BG = (126, 126, 126, 255)
LIGHT_BG = (245, 245, 245, 255)
TRANSPARENT = (0, 0, 0, 0)

CANDIDATE_SIZES = (512, 192, 64, 32, 16)

VARIANTS = {
    "a-orthogonal-disk": {
        "label": "A / orthogonal disk",
        "description": "Filled Poincare disk with four exact boundary-orthogonal geodesic arcs.",
        "mode": "orthogonal",
        "filled": True,
        "feature_color": BLACK,
        "ring_color": BLACK,
        "disk_color": WHITE,
        "detail_stroke": 3.2,
        "ring_stroke": 3.2,
        "center_dot": 2.7,
        "ideal_dot": 1.9,
        "disk_radius": 24.0,
    },
    "b-ideal-triangle": {
        "label": "B / ideal triangle",
        "description": "Filled Poincare disk with a three-sided ideal triangle of exact geodesics.",
        "mode": "triangle",
        "filled": True,
        "feature_color": BLACK,
        "ring_color": BLACK,
        "disk_color": WHITE,
        "detail_stroke": 3.7,
        "ring_stroke": 4.0,
        "center_dot": 2.5,
        "ideal_dot": 2.2,
        "disk_radius": 24.0,
    },
    "c-open-net": {
        "label": "C / open net",
        "description": "Open dark-field Poincare boundary with white geodesic net and origin dot.",
        "mode": "open_net",
        "filled": False,
        "feature_color": WHITE,
        "ring_color": WHITE,
        "disk_color": TRANSPARENT,
        "detail_stroke": 3.0,
        "ring_stroke": 4.2,
        "center_dot": 2.8,
        "ideal_dot": 1.8,
        "disk_radius": 24.0,
    },
    "d-vesica": {
        "label": "D / vesica",
        "description": "Filled Poincare disk with three boundary-orthogonal geodesic arcs and center dot.",
        "mode": "vesica",
        "filled": True,
        "feature_color": BLACK,
        "ring_color": BLACK,
        "disk_color": WHITE,
        "detail_stroke": 3.6,
        "ring_stroke": 4.5,
        "center_dot": 2.6,
        "ideal_dot": 0.0,
        "disk_radius": 24.0,
    },
    "d-vesica-minimal": {
        "label": "D / vesica minimal",
        "description": "Distilled Poincare Vesica using three bold boundary-orthogonal geodesics (Concept v4).",
        "mode": "vesica_minimal",
        "filled": False,
        "feature_color": WHITE,
        "ring_color": WHITE,
        "disk_color": TRANSPARENT,
        "detail_stroke": 2.5,
        "ring_stroke": 3.25,
        "center_dot": 0.0,
        "ideal_dot": 0.0,
        "disk_radius": 22.5,
    },
    "e-monogram": {
        "label": "E / H3 Monogram",
        "description": "Prism-like bold H3 monogram with tangent continuous lines and optical centering (Concept v5).",
        "mode": "monogram",
        "filled": False,
        "feature_color": WHITE,
        "ring_color": TRANSPARENT,
        "disk_color": TRANSPARENT,
        "detail_stroke": 4.0,
        "ring_stroke": 0.0,
        "center_dot": 0.0,
        "ideal_dot": 0.0,
        "disk_radius": 24.0,
    },
    "f-tesseract": {
        "label": "F / Curved Tesseract",
        "description": "Non-Euclidean 4D curved tesseract projected with hyperbolic arcs and vertex anchors (Concept v2).",
        "mode": "tesseract",
        "filled": False,
        "feature_color": WHITE,
        "ring_color": TRANSPARENT,
        "disk_color": TRANSPARENT,
        "detail_stroke": 2.5,
        "ring_stroke": 0.0,
        "center_dot": 0.0,
        "ideal_dot": 0.0,
        "disk_radius": 24.0,
    },
}


def quadratic_bezier(
    p0: tuple[float, float], p1: tuple[float, float], p2: tuple[float, float], steps: int = 40
) -> list[tuple[float, float]]:
    points = []
    for step_index in range(steps + 1):
        t = step_index / steps
        one_minus_t = 1 - t
        x = one_minus_t * one_minus_t * p0[0] + 2 * one_minus_t * t * p1[0] + t * t * p2[0]
        y = one_minus_t * one_minus_t * p0[1] + 2 * one_minus_t * t * p1[1] + t * t * p2[1]
        points.append((x, y))
    return points


def cubic_bezier(
    p0: tuple[float, float],
    p1: tuple[float, float],
    p2: tuple[float, float],
    p3: tuple[float, float],
    steps: int = 40,
) -> list[tuple[float, float]]:
    points = []
    for step_index in range(steps + 1):
        t = step_index / steps
        one_minus_t = 1 - t
        x = (
            one_minus_t * one_minus_t * one_minus_t * p0[0]
            + 3 * one_minus_t * one_minus_t * t * p1[0]
            + 3 * one_minus_t * t * t * p2[0]
            + t * t * t * p3[0]
        )
        y = (
            one_minus_t * one_minus_t * one_minus_t * p0[1]
            + 3 * one_minus_t * one_minus_t * t * p1[1]
            + 3 * one_minus_t * t * t * p2[1]
            + t * t * t * p3[1]
        )
        points.append((x, y))
    return points


def px(value: float, canvas_size: int) -> float:
    return value * canvas_size / VIEWBOX


def point_px(point: tuple[float, float], canvas_size: int) -> tuple[float, float]:
    return (px(point[0], canvas_size), px(point[1], canvas_size))


def boundary_point(angle_degrees: float, radius: float = DISK_RADIUS) -> tuple[float, float]:
    angle_radians = math.radians(angle_degrees)
    center_x, center_y = DISK_CENTER
    return (
        center_x + math.cos(angle_radians) * radius,
        center_y + math.sin(angle_radians) * radius,
    )


def scaled_width(units: float, canvas_size: int) -> int:
    return max(1, int(round(px(units, canvas_size))))


def ellipse_box(
    center: tuple[float, float], radius: float, canvas_size: int
) -> tuple[float, float, float, float]:
    center_x, center_y = point_px(center, canvas_size)
    pixel_radius = px(radius, canvas_size)
    return (
        center_x - pixel_radius,
        center_y - pixel_radius,
        center_x + pixel_radius,
        center_y + pixel_radius,
    )


def relative(point: tuple[float, float]) -> tuple[float, float]:
    return (point[0] - DISK_CENTER[0], point[1] - DISK_CENTER[1])


def geodesic_points(
    start: tuple[float, float], end: tuple[float, float], steps: int = 144
) -> list[tuple[float, float]]:
    start_rel_x, start_rel_y = relative(start)
    end_rel_x, end_rel_y = relative(end)
    determinant = start_rel_x * end_rel_y - start_rel_y * end_rel_x

    if abs(determinant) < 0.001:
        return [
            (
                start[0] + (end[0] - start[0]) * step_index / steps,
                start[1] + (end[1] - start[1]) * step_index / steps,
            )
            for step_index in range(steps + 1)
        ]

    disk_radius_squared = DISK_RADIUS * DISK_RADIUS
    center_rel_x = disk_radius_squared * (end_rel_y - start_rel_y) / determinant
    center_rel_y = disk_radius_squared * (start_rel_x - end_rel_x) / determinant
    geodesic_center = (DISK_CENTER[0] + center_rel_x, DISK_CENTER[1] + center_rel_y)
    geodesic_radius = math.sqrt(center_rel_x * center_rel_x + center_rel_y * center_rel_y - disk_radius_squared)

    start_angle = math.atan2(start[1] - geodesic_center[1], start[0] - geodesic_center[0])
    end_angle = math.atan2(end[1] - geodesic_center[1], end[0] - geodesic_center[0])
    counter_delta = (end_angle - start_angle) % TAU
    clockwise_delta = counter_delta - TAU

    counter_points = sample_circle_arc(geodesic_center, geodesic_radius, start_angle, counter_delta, steps)
    clockwise_points = sample_circle_arc(geodesic_center, geodesic_radius, start_angle, clockwise_delta, steps)
    return arc_inside_disk(counter_points, clockwise_points)


def sample_circle_arc(
    center: tuple[float, float], radius: float, start_angle: float, delta: float, steps: int
) -> list[tuple[float, float]]:
    center_x, center_y = center
    return [
        (
            center_x + math.cos(start_angle + delta * step_index / steps) * radius,
            center_y + math.sin(start_angle + delta * step_index / steps) * radius,
        )
        for step_index in range(steps + 1)
    ]


def arc_inside_disk(
    first_arc: list[tuple[float, float]], second_arc: list[tuple[float, float]]
) -> list[tuple[float, float]]:
    first_score = inside_disk_score(first_arc)
    second_score = inside_disk_score(second_arc)
    if first_score > second_score:
        return first_arc
    if second_score > first_score:
        return second_arc
    return first_arc if arc_length(first_arc) <= arc_length(second_arc) else second_arc


def inside_disk_score(points: list[tuple[float, float]]) -> int:
    center_x, center_y = DISK_CENTER
    radius_limit = (DISK_RADIUS + 0.05) * (DISK_RADIUS + 0.05)
    return sum(
        1
        for point_x, point_y in points
        if (point_x - center_x) * (point_x - center_x) + (point_y - center_y) * (point_y - center_y) <= radius_limit
    )


def arc_length(points: list[tuple[float, float]]) -> float:
    return sum(
        math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1])
        for index in range(1, len(points))
    )


def draw_polyline(
    draw_context: ImageDraw.ImageDraw,
    points: list[tuple[float, float]],
    canvas_size: int,
    color: tuple[int, int, int, int],
    width_units: float,
) -> None:
    draw_context.line(
        [point_px(point, canvas_size) for point in points],
        fill=color,
        width=scaled_width(width_units, canvas_size),
        joint="curve",
    )


def draw_orthogonal_features(
    draw_context: ImageDraw.ImageDraw,
    canvas_size: int,
    color: tuple[int, int, int, int],
    width_units: float,
) -> None:
    for geodesic_center in ((8.0, 8.0), (56.0, 8.0), (56.0, 56.0), (8.0, 56.0)):
        draw_context.ellipse(
            ellipse_box(geodesic_center, 24.0, canvas_size),
            outline=color,
            width=scaled_width(width_units, canvas_size),
        )


def draw_triangle_features(
    draw_context: ImageDraw.ImageDraw,
    canvas_size: int,
    color: tuple[int, int, int, int],
    width_units: float,
) -> None:
    triangle_points = [boundary_point(-90), boundary_point(30), boundary_point(150)]
    geodesic_pairs = (
        (triangle_points[0], triangle_points[1]),
        (triangle_points[1], triangle_points[2]),
        (triangle_points[2], triangle_points[0]),
    )
    for start, end in geodesic_pairs:
        draw_polyline(draw_context, geodesic_points(start, end), canvas_size, color, width_units)


def draw_open_net_features(
    draw_context: ImageDraw.ImageDraw,
    canvas_size: int,
    color: tuple[int, int, int, int],
    width_units: float,
) -> None:
    draw_orthogonal_features(draw_context, canvas_size, color, width_units)
    for line_angle in (0, 90):
        start = boundary_point(line_angle)
        end = boundary_point(line_angle + 180)
        draw_polyline(draw_context, geodesic_points(start, end), canvas_size, color, width_units * 0.86)


def draw_features(
    draw_context: ImageDraw.ImageDraw,
    variant: dict[str, object],
    canvas_size: int,
    compact: bool,
) -> None:
    mode = str(variant["mode"])
    feature_color = variant["feature_color"]
    detail_stroke = float(variant["detail_stroke"])
    if compact and mode == "open_net":
        return
    if compact and mode == "orthogonal":
        detail_stroke *= 1.6
    elif compact:
        detail_stroke *= 1.2
    if mode == "orthogonal":
        draw_orthogonal_features(draw_context, canvas_size, feature_color, detail_stroke)
    elif mode == "triangle":
        draw_triangle_features(draw_context, canvas_size, feature_color, detail_stroke)
    elif mode == "vesica":
        for geodesic_center in ((8.0, 8.0), (56.0, 8.0), (8.0, 56.0)):
            draw_context.ellipse(
                ellipse_box(geodesic_center, 24.0, canvas_size),
                outline=feature_color,
                width=scaled_width(detail_stroke, canvas_size),
            )
    elif mode == "open_net":
        draw_open_net_features(draw_context, canvas_size, feature_color, detail_stroke)
    elif mode == "vesica_minimal":
        for geodesic_center in ((9.5, 9.5), (54.5, 9.5), (9.5, 54.5)):
            draw_context.ellipse(
                ellipse_box(geodesic_center, 22.5, canvas_size),
                outline=feature_color,
                width=scaled_width(detail_stroke, canvas_size),
            )
    elif mode == "monogram":
        left_leg_pts = quadratic_bezier((17.25, 15.0), (21.625, 32.0), (17.25, 49.0))
        draw_polyline(draw_context, left_leg_pts, canvas_size, feature_color, detail_stroke)
        cross_bar = [(18.75, 32.0), (30.5, 32.0)]
        top_lobe = cubic_bezier((30.5, 32.0), (46.0, 32.0), (44.75, 15.0), (30.5, 15.0))
        draw_polyline(draw_context, cross_bar + top_lobe[1:], canvas_size, feature_color, detail_stroke)
        bottom_lobe = cubic_bezier((30.5, 32.0), (46.0, 32.0), (44.75, 49.0), (30.5, 49.0))
        draw_polyline(draw_context, bottom_lobe, canvas_size, feature_color, detail_stroke)
    elif mode == "tesseract":
        outer_stroke = detail_stroke
        inner_stroke = detail_stroke * (14.0 / 20.0)
        diagonal_stroke = detail_stroke * (12.0 / 20.0)
        if compact:
            inner_stroke *= 1.2
            diagonal_stroke *= 1.2
        diag1 = quadratic_bezier((14.0, 14.0), (17.0, 22.0), (25.0, 25.0))
        diag2 = quadratic_bezier((50.0, 14.0), (47.0, 22.0), (39.0, 25.0))
        diag3 = quadratic_bezier((50.0, 50.0), (47.0, 42.0), (39.0, 39.0))
        diag4 = quadratic_bezier((14.0, 50.0), (17.0, 42.0), (25.0, 39.0))
        diagonal_color = (feature_color[0], feature_color[1], feature_color[2], 153)
        for diag in (diag1, diag2, diag3, diag4):
            draw_polyline(draw_context, diag, canvas_size, diagonal_color, diagonal_stroke)
        outer_p1 = quadratic_bezier((14.0, 14.0), (32.0, 19.5), (50.0, 14.0))
        outer_p2 = quadratic_bezier((50.0, 14.0), (44.5, 32.0), (50.0, 50.0))
        outer_p3 = quadratic_bezier((50.0, 50.0), (32.0, 44.5), (14.0, 50.0))
        outer_p4 = quadratic_bezier((14.0, 50.0), (19.5, 32.0), (14.0, 14.0))
        outer_frame = outer_p1 + outer_p2[1:] + outer_p3[1:] + outer_p4[1:]
        draw_polyline(draw_context, outer_frame, canvas_size, feature_color, outer_stroke)
        inner_p1 = quadratic_bezier((25.0, 25.0), (32.0, 27.5), (39.0, 25.0))
        inner_p2 = quadratic_bezier((39.0, 25.0), (36.5, 32.0), (39.0, 39.0))
        inner_p3 = quadratic_bezier((39.0, 39.0), (32.0, 36.5), (25.0, 39.0))
        inner_p4 = quadratic_bezier((25.0, 39.0), (27.5, 32.0), (25.0, 25.0))
        inner_frame = inner_p1 + inner_p2[1:] + inner_p3[1:] + inner_p4[1:]
        draw_polyline(draw_context, inner_frame, canvas_size, feature_color, inner_stroke)


def draw_dots(
    draw_context: ImageDraw.ImageDraw,
    variant: dict[str, object],
    canvas_size: int,
    compact: bool,
) -> None:
    feature_color = variant["feature_color"]
    mode = str(variant["mode"])
    if mode == "tesseract":
        outer_radius = 2.0 * (1.2 if compact else 1.0)
        for point in ((14.0, 14.0), (50.0, 14.0), (50.0, 50.0), (14.0, 50.0)):
            draw_context.ellipse(ellipse_box(point, outer_radius, canvas_size), fill=feature_color)
        inner_radius = 1.375 * (1.2 if compact else 1.0)
        for point in ((25.0, 25.0), (39.0, 25.0), (39.0, 39.0), (25.0, 39.0)):
            draw_context.ellipse(ellipse_box(point, inner_radius, canvas_size), fill=feature_color)
        return
    if mode in ("monogram", "vesica_minimal"):
        return
    center_dot_radius = float(variant["center_dot"]) * (1.26 if compact else 1.0)
    ideal_dot_radius = float(variant["ideal_dot"]) * (1.18 if compact else 1.0)
    ideal_angles = (-90, 0, 90, 180)
    if mode == "triangle":
        ideal_angles = (-90, 30, 150)
    elif mode == "vesica":
        ideal_angles = ()
    elif compact and mode == "orthogonal":
        ideal_angles = ()
    for ideal_angle in ideal_angles:
        ideal_point = boundary_point(ideal_angle)
        draw_context.ellipse(ellipse_box(ideal_point, ideal_dot_radius, canvas_size), fill=feature_color)
    draw_context.ellipse(ellipse_box(DISK_CENTER, center_dot_radius, canvas_size), fill=feature_color)


def disk_mask(canvas_size: int, bleed: float, disk_radius: float) -> Image.Image:
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse(ellipse_box(DISK_CENTER, disk_radius * (1.0 + bleed), canvas_size), fill=255)
    return mask


def render_icon(
    variant_id: str,
    size: int,
    *,
    rounded: bool = True,
    bleed: float = 0.0,
    compact: bool = False,
) -> Image.Image:
    variant = VARIANTS[variant_id]
    canvas_size = size * SUPERSAMPLE
    image = Image.new("RGBA", (canvas_size, canvas_size), TRANSPARENT)
    draw_context = ImageDraw.Draw(image)

    if rounded:
        draw_context.rounded_rectangle(
            (0, 0, canvas_size - 1, canvas_size - 1),
            radius=FIELD_RADIUS_RATIO * canvas_size,
            fill=BLACK,
        )
    else:
        draw_context.rectangle((0, 0, canvas_size - 1, canvas_size - 1), fill=BLACK)

    disk_radius = float(variant.get("disk_radius", DISK_RADIUS))

    if bool(variant["filled"]):
        draw_context.ellipse(
            ellipse_box(DISK_CENTER, disk_radius * (1.0 + bleed), canvas_size),
            fill=variant["disk_color"],
        )

    feature_layer = Image.new("RGBA", (canvas_size, canvas_size), TRANSPARENT)
    feature_draw = ImageDraw.Draw(feature_layer)
    draw_features(feature_draw, variant, canvas_size, compact)
    clipped_features = Image.new("RGBA", (canvas_size, canvas_size), TRANSPARENT)
    
    if variant["mode"] in ("monogram", "tesseract"):
        image = Image.alpha_composite(image, feature_layer)
    else:
        clipped_features.paste(feature_layer, (0, 0), disk_mask(canvas_size, bleed, disk_radius))
        image = Image.alpha_composite(image, clipped_features)

    overlay = Image.new("RGBA", (canvas_size, canvas_size), TRANSPARENT)
    overlay_draw = ImageDraw.Draw(overlay)
    
    if variant["mode"] not in ("monogram", "tesseract"):
        overlay_draw.ellipse(
            ellipse_box(DISK_CENTER, disk_radius * (1.0 + bleed), canvas_size),
            outline=variant["ring_color"],
            width=scaled_width(float(variant["ring_stroke"]) * (1.2 if compact else 1.0), canvas_size),
        )
        draw_dots(overlay_draw, variant, canvas_size, compact)
        image = Image.alpha_composite(image, overlay)
    elif variant["mode"] == "tesseract":
        draw_dots(overlay_draw, variant, canvas_size, compact)
        image = Image.alpha_composite(image, overlay)

    return image.resize((size, size), Image.LANCZOS)


def svg_path_from_points(points: list[tuple[float, float]]) -> str:
    first_point = points[0]
    commands = [f"M {first_point[0]:.3f} {first_point[1]:.3f}"]
    commands.extend(f"L {point_x:.3f} {point_y:.3f}" for point_x, point_y in points[1:])
    return " ".join(commands)


def candidate_svg(variant_id: str) -> str:
    if variant_id == "d-vesica-minimal":
        return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" aria-labelledby="title desc" role="img">
  <title id="title">hyper3labs Poincaré Vesica (Minimal)</title>
  <desc id="desc">A distilled, highly scalable representation of the Poincaré Vesica logo using three bold boundary-orthogonal geodesics and an outer boundary ring.</desc>
  <rect width="512" height="512" rx="112" fill="#0A0A0B"/>
  <defs>
    <clipPath id="disk-clip">
      <circle cx="256" cy="256" r="180" />
    </clipPath>
  </defs>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#FFFFFF" stroke-width="26" />
  <g clip-path="url(#disk-clip)" fill="none" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="76" cy="76" r="180"/>
    <circle cx="436" cy="76" r="180"/>
    <circle cx="76" cy="436" r="180"/>
  </g>
</svg>
'''
    elif variant_id == "e-monogram":
        return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" aria-labelledby="title desc" role="img">
  <title id="title">hyper3labs H3 Monogram (Refined)</title>
  <desc id="desc">A highly refined and optically centered H3 monogram, combining the letter H and the number 3 using clean, continuous tangent curves and bold minimalism.</desc>
  <rect width="512" height="512" rx="112" fill="#0A0A0B"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 138 120 Q 173 256 138 392" />
    <path d="M 150 256 L 244 256 C 368 256 358 120 244 120" />
    <path d="M 244 256 C 368 256 358 392 244 392" />
  </g>
</svg>
'''
    elif variant_id == "f-tesseract":
        return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" aria-labelledby="title desc" role="img">
  <title id="title">hyper3labs Curved Tesseract Logo</title>
  <desc id="desc">A mathematically precise non-Euclidean curved tesseract, projecting a hypercube using hyperbolic geodesics and symmetric arcs.</desc>
  <rect width="512" height="512" rx="112" fill="#0A0A0B"/>
  <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 112 112 Q 136 176 200 200" stroke-width="12" opacity="0.6" />
    <path d="M 400 112 Q 376 176 312 200" stroke-width="12" opacity="0.6" />
    <path d="M 400 400 Q 376 336 312 312" stroke-width="12" opacity="0.6" />
    <path d="M 112 400 Q 136 336 200 312" stroke-width="12" opacity="0.6" />
    <path d="M 112 112 Q 256 156 400 112
             Q 356 256 400 400
             Q 256 356 112 400
             Q 156 256 112 112 Z" stroke-width="20" />
    <path d="M 200 200 Q 256 220 312 200
             Q 292 256 312 312
             Q 256 292 200 312
             Q 220 256 200 200 Z" stroke-width="14" />
  </g>
  <g fill="#FFFFFF">
    <circle cx="112" cy="112" r="16" />
    <circle cx="400" cy="112" r="16" />
    <circle cx="400" cy="400" r="16" />
    <circle cx="112" cy="400" r="16" />
    <circle cx="200" cy="200" r="11" />
    <circle cx="312" cy="200" r="11" />
    <circle cx="312" cy="312" r="11" />
    <circle cx="200" cy="312" r="11" />
  </g>
</svg>
'''
    variant = VARIANTS[variant_id]
    title = str(variant["label"])
    description = str(variant["description"])
    disk_fill = "#ffffff" if bool(variant["filled"]) else "none"
    feature_color = "#0a0a0a" if variant["feature_color"] == BLACK else "#ffffff"
    ring_color = "#0a0a0a" if variant["ring_color"] == BLACK else "#ffffff"
    mode = str(variant["mode"])
    feature_stroke = float(variant["detail_stroke"])
    feature_markup = ""

    if mode == "orthogonal":
        feature_markup = "\n".join(
            f'    <circle cx="{center_x:g}" cy="{center_y:g}" r="24"/>'
            for center_x, center_y in ((8.0, 8.0), (56.0, 8.0), (56.0, 56.0), (8.0, 56.0))
        )
    elif mode == "vesica":
        feature_markup = "\n".join(
            f'    <circle cx="{center_x:g}" cy="{center_y:g}" r="24"/>'
            for center_x, center_y in ((8.0, 8.0), (56.0, 8.0), (8.0, 56.0))
        )
    elif mode == "triangle":
        triangle_points = [boundary_point(-90), boundary_point(30), boundary_point(150)]
        feature_markup = "\n".join(
            f'    <path d="{svg_path_from_points(geodesic_points(start, end, 72))}"/>'
            for start, end in (
                (triangle_points[0], triangle_points[1]),
                (triangle_points[1], triangle_points[2]),
                (triangle_points[2], triangle_points[0]),
            )
        )
    else:
        circles = "\n".join(
            f'    <circle cx="{center_x:g}" cy="{center_y:g}" r="24"/>'
            for center_x, center_y in ((8.0, 8.0), (56.0, 8.0), (56.0, 56.0), (8.0, 56.0))
        )
        diameters = "\n".join(
            f'    <path d="{svg_path_from_points(geodesic_points(boundary_point(angle), boundary_point(angle + 180), 2))}"/>'
            for angle in (0, 90)
        )
        feature_markup = f"{circles}\n{diameters}"

    ideal_dot_radius = float(variant["ideal_dot"])
    center_dot_radius = float(variant["center_dot"])
    if mode == "vesica":
        ideal_angles = ()
    elif mode == "triangle":
        ideal_angles = (-90, 30, 150)
    else:
        ideal_angles = (-90, 0, 90, 180)
    ideal_markup = "\n".join(
        f'    <circle cx="{boundary_point(angle)[0]:.3f}" cy="{boundary_point(angle)[1]:.3f}" r="{ideal_dot_radius:g}"/>'
        for angle in ideal_angles
    )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title desc">
  <title id="title">hyper3labs favicon {title}</title>
  <desc id="desc">{description}</desc>
  <rect width="64" height="64" rx="12" ry="12" fill="#0a0a0a"/>
  <defs>
    <clipPath id="disk"><circle cx="32" cy="32" r="24"/></clipPath>
  </defs>
  <circle cx="32" cy="32" r="24" fill="{disk_fill}"/>
  <g clip-path="url(#disk)" fill="none" stroke="{feature_color}" stroke-width="{feature_stroke:g}" stroke-linecap="round" stroke-linejoin="round">
{feature_markup}
  </g>
  <circle cx="32" cy="32" r="24" fill="none" stroke="{ring_color}" stroke-width="{float(variant["ring_stroke"]):g}"/>
  <g fill="{feature_color}">
{ideal_markup}
    <circle cx="32" cy="32" r="{center_dot_radius:g}"/>
  </g>
</svg>
'''


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)
    print(f"Wrote {path.relative_to(ROOT)} ({image.width}x{image.height})")


def save_text(text: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"Wrote {path.relative_to(ROOT)}")


def make_preview_tile(icon: Image.Image, background: tuple[int, int, int, int], tile_size: int = 116) -> Image.Image:
    tile = Image.new("RGBA", (tile_size, tile_size), background)
    icon_x = (tile_size - icon.width) // 2
    icon_y = (tile_size - icon.height) // 2
    tile.alpha_composite(icon, (icon_x, icon_y))
    return tile


def paste_label(draw_context: ImageDraw.ImageDraw, xy: tuple[int, int], label: str) -> None:
    draw_context.text(xy, label, fill=(230, 230, 230, 255), font=ImageFont.load_default())


def candidate_board(variant_id: str) -> Image.Image:
    margin = 24
    tile_size = 116
    gap = 16
    row_gap = 34
    board_width = margin * 2 + len(CANDIDATE_SIZES) * tile_size + (len(CANDIDATE_SIZES) - 1) * gap
    board_height = margin * 2 + 28 + 3 * tile_size + 2 * row_gap + 24
    board = Image.new("RGBA", (board_width, board_height), BLACK)
    draw_context = ImageDraw.Draw(board)
    paste_label(draw_context, (margin, margin), str(VARIANTS[variant_id]["label"]))
    backgrounds = (("dark", BLACK), ("gray", GRAY_BG), ("light", LIGHT_BG))
    start_y = margin + 28
    for row_index, (row_label, background) in enumerate(backgrounds):
        row_y = start_y + row_index * (tile_size + row_gap)
        paste_label(draw_context, (margin, row_y + tile_size + 4), row_label)
        for column_index, icon_size in enumerate(CANDIDATE_SIZES):
            compact = icon_size <= 32
            icon = render_icon(variant_id, icon_size, compact=compact)
            tile = make_preview_tile(icon, background, tile_size)
            tile_x = margin + column_index * (tile_size + gap)
            board.alpha_composite(tile, (tile_x, row_y))
            paste_label(draw_context, (tile_x + 4, row_y + 4), f"{icon_size}px")
    return board


def all_candidates_board() -> Image.Image:
    boards = [candidate_board(variant_id) for variant_id in VARIANTS]
    gap = 20
    width = max(board.width for board in boards)
    height = sum(board.height for board in boards) + gap * (len(boards) - 1)
    combined = Image.new("RGBA", (width, height), BLACK)
    current_y = 0
    for board in boards:
        combined.alpha_composite(board, (0, current_y))
        current_y += board.height + gap
    return combined


def write_candidates() -> None:
    for variant_id in VARIANTS:
        save_text(candidate_svg(variant_id), GENERATED_DIR / f"{variant_id}.svg")
        for icon_size in CANDIDATE_SIZES:
            save_png(
                render_icon(variant_id, icon_size, compact=icon_size <= 32),
                GENERATED_DIR / f"{variant_id}-{icon_size}.png",
            )
        save_png(candidate_board(variant_id), GENERATED_DIR / f"{variant_id}-preview.png")
    save_png(all_candidates_board(), GENERATED_DIR / "favicon-candidates-comparison.png")


def write_production_assets() -> None:
    save_text(candidate_svg(SELECTED_VARIANT_ID), ROOT / "app" / "icon.svg")
    save_png(render_icon(SELECTED_VARIANT_ID, 192), ROOT / "public" / "icon-192.png")
    save_png(render_icon(SELECTED_VARIANT_ID, 512), ROOT / "public" / "icon-512.png")
    save_png(
        render_icon(SELECTED_VARIANT_ID, 512, rounded=False, bleed=0.10),
        ROOT / "public" / "icon-mask.png",
    )
    save_png(render_icon(SELECTED_VARIANT_ID, 180), ROOT / "app" / "apple-icon.png")

    ico_path = ROOT / "app" / "favicon.ico"
    ico_sizes = [48, 32, 16]
    ico_images = [render_icon(SELECTED_VARIANT_ID, icon_size, compact=icon_size <= 32) for icon_size in ico_sizes]
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(icon_size, icon_size) for icon_size in ico_sizes],
        append_images=ico_images[1:],
    )
    print(f"Wrote {ico_path.relative_to(ROOT)} (48 detail, 32/16 compact)")


def main() -> None:
    write_candidates()
    write_production_assets()


if __name__ == "__main__":
    main()
