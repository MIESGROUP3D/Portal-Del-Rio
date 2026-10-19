'use client';

import { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import type { ExternalTourConfig } from '@/lib/tour-types';

const fmt = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 2 });

/** Pop-up con un recorrido 360 de terceros (Matterport) dentro de un iframe.
 *  Las areas van en la franja superior, siempre visibles mientras esta abierto. */
export default function ExternalTourModal({ tour, onClose }: { tour: ExternalTourConfig; onClose: () => void }) {
  const title = tour.group ? `${tour.group} - ${tour.label}` : tour.label;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4"
      style={{ background: 'rgba(10, 10, 10,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col w-full"
        style={{
          maxWidth: 1760,
          height: '100%',
          background: 'rgba(18, 18, 18,0.98)',
          border: '1px solid rgba(255, 255, 255,0.18)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255, 255, 255,0.12)', color: '#FFFFFF' }}
        >
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tracking-widest uppercase truncate">{title}</div>
            {/* En pantallas chicas la etiqueta flotante taparia el visor: las areas van aqui */}
            <div className="sm:hidden text-[11px] mt-1" style={{ color: 'rgba(255, 255, 255,0.75)' }}>
              Construida {fmt(tour.area)} m²{tour.areaPrivada ? <> · Privada {fmt(tour.areaPrivada)} m²</> : null}
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
          <a
            href={tour.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir el recorrido en una pestaña nueva"
            title="Abrir en una pestaña nueva"
            className="flex items-center justify-center"
            style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255, 255, 255,0.25)', color: '#FFFFFF', background: 'transparent' }}
          >
            <ExternalLink size={15} />
          </a>
          <button
            onClick={onClose}
            aria-label="Cerrar recorrido"
            className="shrink-0 flex items-center justify-center"
            style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255, 255, 255,0.25)', color: '#FFFFFF', background: 'transparent', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
          </div>
        </div>
        <div className="relative flex-1 w-full min-h-0">
          <iframe
            src={tour.url}
            title={title}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0, background: '#1C2430' }}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
          />
          {/* Etiqueta flotante de areas: siempre visible mientras el 360 esta abierto */}
          <div
            className="absolute pointer-events-none hidden sm:block"
            style={{
              top: 104,
              left: 14,
              padding: '10px 14px',
              background: 'rgba(18, 18, 18,0.88)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255,0.2)',
              borderLeft: '3px solid #F4AC5C',
              borderRadius: 8,
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
          >
            <div className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255, 255, 255,0.6)' }}>Área construida</div>
            <div className="text-[15px] font-semibold">{fmt(tour.area)} m²</div>
            {tour.areaPrivada ? (
              <>
                <div className="text-[10px] tracking-widest uppercase mt-2" style={{ color: 'rgba(255, 255, 255,0.6)' }}>Área privada</div>
                <div className="text-[15px] font-semibold">{fmt(tour.areaPrivada)} m²</div>
              </>
            ) : null}
          </div>
        </div>
        <div className="px-5 py-2 text-[10px]" style={{ color: 'rgba(255, 255, 255,0.45)', borderTop: '1px solid rgba(255, 255, 255,0.08)' }}>
          Recorrido 360° alojado en Matterport (tercero). Las áreas están sujetas a ajustes por razones técnicas o licencia.
        </div>
      </div>
    </div>
  );
}
