async function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* tenta o método clássico */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Recorta ao centro em quadrado e reduz (256 px, JPEG). Fica pequeno o bastante (~20-40 KB)
// para ser guardado no próprio documento do utilizador, sem precisar do Firebase Storage (plano Blaze).
export async function fileToAvatarDataUrl(file, size = 256, quality = 0.82) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Escolhe um ficheiro de imagem.');
  const bitmap = await loadBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  return canvas.toDataURL('image/jpeg', quality);
}
