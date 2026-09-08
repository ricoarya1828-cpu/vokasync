/**
 * Canvas Composite Engine
 * Pure functions untuk komposit frame + produk + watermark
 * 
 * PRD FR-3: AI Virtual Studio
 * TECHNICAL_SPEC Section 4.4: Canvas composite pipeline
 */

import type { FrameTemplate } from '@/types';

const CANVAS_SIZE = 1080; // 1080x1080px (Instagram square)
const PRODUCT_SAFE_ZONE = 700; // 700x700px safe zone untuk produk

export interface CompositeParams {
  canvas: HTMLCanvasElement;
  frameTemplate: FrameTemplate;
  productImageUrl: string;
  priceLabel: string;
  watermarkPosition: { x: number; y: number };
}

/**
 * Main composite function
 * Combines: frame background + product (transparent) + price watermark
 */
export async function compositeStudioImage(
  params: CompositeParams
): Promise<void> {
  const { canvas, frameTemplate, productImageUrl, priceLabel, watermarkPosition } = params;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context tidak tersedia');

  // Set canvas size
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  try {
    // Layer 1: Frame background
    const frameImage = await loadImage(getFramePath(frameTemplate));
    ctx.drawImage(frameImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Layer 2: Product image (centered in safe zone)
    const productImage = await loadImage(productImageUrl);
    drawCenteredProduct(ctx, productImage);

    // Layer 3: Price watermark
    drawPriceWatermark(ctx, priceLabel, watermarkPosition);

  } catch (error) {
    console.error('Composite error:', error);
    throw error;
  }
}

/**
 * Get frame image path from template name
 */
function getFramePath(template: FrameTemplate): string {
  const paths: Record<FrameTemplate, string> = {
    minimalis: '/frames/frame-minimalis.png',
    pasar: '/frames/frame-pasar.png',
    kriya: '/frames/frame-kriya.png',
  };
  return paths[template];
}

/**
 * Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Draw product image centered in safe zone
 * Maintains aspect ratio, fits within 700x700px
 */
function drawCenteredProduct(
  ctx: CanvasRenderingContext2D,
  productImage: HTMLImageElement
): void {
  const maxSize = PRODUCT_SAFE_ZONE;
  const imgRatio = productImage.width / productImage.height;

  let drawWidth = maxSize;
  let drawHeight = maxSize;

  // Maintain aspect ratio
  if (imgRatio > 1) {
    // Landscape
    drawHeight = maxSize / imgRatio;
  } else if (imgRatio < 1) {
    // Portrait
    drawWidth = maxSize * imgRatio;
  }

  // Center in canvas
  const offsetX = (CANVAS_SIZE - drawWidth) / 2;
  const offsetY = (CANVAS_SIZE - drawHeight) / 2;

  ctx.drawImage(productImage, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Draw price watermark with stroke outline
 * Font: bold 48px sans-serif
 * Color: white with black stroke
 */
function drawPriceWatermark(
  ctx: CanvasRenderingContext2D,
  priceLabel: string,
  position: { x: number; y: number }
): void {
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Stroke (outline)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.strokeText(priceLabel, position.x, position.y);

  // Fill (text)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(priceLabel, position.x, position.y);
}

/**
 * Export canvas to Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Export canvas to Data URL
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/png',
  quality: number = 0.92
): string {
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Measure text width for positioning
 */
export function measureTextWidth(
  text: string,
  font: string = 'bold 48px sans-serif'
): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  ctx.font = font;
  return ctx.measureText(text).width;
}
