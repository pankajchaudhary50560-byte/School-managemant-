// Utility for compressing and processing student photos for ID cards and admission

export function compressImageFile(
  file: File,
  maxWidth = 320,
  maxHeight = 380,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Student Avatar Presets with school uniform style
export const STUDENT_AVATAR_PRESETS = [
  {
    id: 'boy-1',
    name: 'Boy 1 (Navy Uniform)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect width="100" height="120" fill="%23e0f2fe"/><circle cx="50" cy="40" r="24" fill="%23fcd34d"/><path d="M30 35 Q50 15 70 35 Q50 22 30 35" fill="%231e293b"/><circle cx="42" cy="42" r="3" fill="%231e293b"/><circle cx="58" cy="42" r="3" fill="%231e293b"/><path d="M44 54 Q50 58 56 54" stroke="%23b45309" stroke-width="2" fill="none"/><path d="M15 120 L35 70 L65 70 L85 120 Z" fill="%231e3a8a"/><polygon points="46,70 54,70 52,100 48,100" fill="%23dc2626"/><polygon points="50,70 42,75 50,85 58,75" fill="%23ffffff"/></svg>',
  },
  {
    id: 'girl-1',
    name: 'Girl 1 (Red Tie)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect width="100" height="120" fill="%23fce7f3"/><circle cx="50" cy="40" r="23" fill="%23fcd34d"/><path d="M25 32 Q50 10 75 32 Q80 65 72 65 Q50 35 28 65 Q20 65 25 32" fill="%233b1e08"/><circle cx="42" cy="42" r="3" fill="%231e293b"/><circle cx="58" cy="42" r="3" fill="%231e293b"/><path d="M44 53 Q50 57 56 53" stroke="%23b45309" stroke-width="2" fill="none"/><path d="M15 120 L35 70 L65 70 L85 120 Z" fill="%231e3a8a"/><polygon points="46,70 54,70 52,95 48,95" fill="%23e11d48"/><polygon points="50,70 42,75 50,85 58,75" fill="%23ffffff"/></svg>',
  },
  {
    id: 'boy-2',
    name: 'Boy 2 (Blazer)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect width="100" height="120" fill="%23f1f5f9"/><circle cx="50" cy="38" r="23" fill="%23fde68a"/><path d="M28 32 Q50 14 72 32 Q50 20 28 32" fill="%230f172a"/><circle cx="43" cy="40" r="3" fill="%230f172a"/><circle cx="57" cy="40" r="3" fill="%230f172a"/><path d="M45 52 Q50 55 55 52" stroke="%2392400e" stroke-width="2" fill="none"/><path d="M12 120 L32 68 L68 68 L88 120 Z" fill="%23172554"/><polygon points="46,68 54,68 52,98 48,98" fill="%232563eb"/><polygon points="50,68 40,73 50,83 60,73" fill="%23ffffff"/></svg>',
  },
  {
    id: 'girl-2',
    name: 'Girl 2 (Ribbon)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><rect width="100" height="120" fill="%23fdf4ff"/><circle cx="50" cy="40" r="23" fill="%23fde68a"/><path d="M26 35 Q50 12 74 35 Q78 68 70 68 Q50 38 30 68 Q22 68 26 35" fill="%23172554"/><circle cx="43" cy="41" r="3" fill="%230f172a"/><circle cx="57" cy="41" r="3" fill="%230f172a"/><path d="M45 53 Q50 57 55 53" stroke="%2392400e" stroke-width="2" fill="none"/><path d="M14 120 L34 70 L66 70 L86 120 Z" fill="%23047857"/><polygon points="46,70 54,70 52,95 48,95" fill="%23f59e0b"/><polygon points="50,70 42,75 50,84 58,75" fill="%23ffffff"/></svg>',
  },
];
