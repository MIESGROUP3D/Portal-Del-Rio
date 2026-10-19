'use client';

import type { CSSProperties } from 'react';
import { assetPath } from '@/lib/asset-path';

// PNG transparentes generados de los JPG del cliente (TL_Pradera Horizontal / TL Pradera Vertical).
// `dark`: version para fondo oscuro (rojo de marca + blanco). `mask`: silueta para teñir.
const BRAND = (file: string) => assetPath(`/projects/melendez/branding/${file}`);
const LOGOS = {
  horizontal: { dark: BRAND('LogoPortalDelRioHorizontalOscuro.png'), mask: BRAND('LogoPortalDelRioHorizontal.png'), ratio: '822 / 207' },
  vertical:   { dark: BRAND('LogoPortalDelRioVerticalOscuro.png'),   mask: BRAND('LogoPortalDelRioVertical.png'),   ratio: '572 / 479' },
};

interface Props {
  className?: string;
  style?: CSSProperties;
  /** Si se define, el logo se tiñe de este color sólido (mask-image). Sin él: rojo + blanco de marca. */
  color?: string;
  /** Version del logo (default: horizontal). */
  variant?: keyof typeof LOGOS;
}

/**
 * Logo del proyecto para fondos oscuros, manteniendo el aspect ratio del PNG.
 * Define solo width o height en `style`/`className`; la otra dimensión se calcula sola.
 */
export default function BrandLogo({ className, style, color, variant = 'horizontal' }: Props) {
  const logo = LOGOS[variant];
  const fill: CSSProperties = color
    ? {
        backgroundColor: color,
        maskImage: `url("${logo.mask}")`,
        WebkitMaskImage: `url("${logo.mask}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }
    : {
        backgroundImage: `url("${logo.dark}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      };
  return (
    <span
      role="img"
      aria-label="Portal del Río"
      className={className}
      style={{ display: 'block', aspectRatio: logo.ratio, ...fill, ...style }}
    />
  );
}
