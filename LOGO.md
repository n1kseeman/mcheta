# Обработка логотипа

Результат: `assets/logo-transparent.png`. Исходник: `assets/logo-original.png`.
Режим: встроенный инструмент Imagegen, редактирование изображения.

Фон удалён с сохранением альфа-канала. PNG проверен: альфа от 0 до 255, более миллиона полностью прозрачных пикселей. Изображение не содержит белой фоновой подложки. CSS показывает знак в размере 90 × 80 px в шапке и 108 × 96 px в подвале; object-fit компенсирует прозрачные боковые поля.

## Использованный промпт

Use case: background-extraction. Edit target: the supplied exact restaurant logo image. Remove ALL white/off-white background to actual alpha transparency, including all white interior spaces within the jug, grape outlines and two bowls. Preserve the exact original muted gold color and exact silhouette, asymmetrical jug spout, grape bunch, leaves, bowl ornaments and every original line. This is a faithful background removal, NOT a redesign. Trim excessive empty margins so the complete emblem fills approximately 94% of a tightly framed canvas, with a small even transparent safety margin. Crisp antialiased edges, no white halo. No text, no new elements, no background, no shadows, no checkerboard baked into pixels. Output transparent PNG appropriate for a website logo.
