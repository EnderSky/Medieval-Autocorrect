"""
Generate medieval-themed icons for the Chrome extension.
Run: python generate_icons.py
"""

try:
    from PIL import Image, ImageDraw
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("PIL not available, creating simple canvas-based icons...")

def create_icon_pil(size):
    """Create icon using PIL"""
    img = Image.new('RGB', (size, size), color=(44, 24, 16))
    draw = ImageDraw.Draw(img)
    
    # Border
    border_width = max(2, size // 32)
    draw.rectangle(
        [border_width, border_width, size - border_width, size - border_width],
        outline=(212, 175, 55),
        width=border_width
    )
    
    # Shield shape
    shield_color = (139, 90, 43)
    gold = (212, 175, 55)
    margin = size // 4
    shield_points = [
        (size // 2, margin),
        (size - margin, margin + size // 6),
        (size - margin, size - margin - size // 8),
        (size // 2, size - margin + size // 10),
        (margin, size - margin - size // 8),
        (margin, margin + size // 6),
    ]
    draw.polygon(shield_points, fill=shield_color, outline=gold, width=max(1, size // 64))
    
    # Sword
    center_x, center_y = size // 2, size // 2
    sword_width = max(2, size // 16)
    sword_height = size // 3
    draw.rectangle(
        [center_x - sword_width // 2, center_y - sword_height // 2,
         center_x + sword_width // 2, center_y + sword_height // 2],
        fill=gold
    )
    crossguard_width = size // 6
    crossguard_height = sword_width
    draw.rectangle(
        [center_x - crossguard_width // 2, center_y - crossguard_height,
         center_x + crossguard_width // 2, center_y],
        fill=gold
    )
    
    return img

if __name__ == '__main__':
    if HAS_PIL:
        for size in [16, 48, 128]:
            icon = create_icon_pil(size)
            icon.save(f'icon{size}.png')
            print(f'Generated icon{size}.png')
        print('\nIcons generated successfully!')
    else:
        print("\nPillow not installed.")
        print("Install with: pip install pillow")
        print("Then run this script again.")
