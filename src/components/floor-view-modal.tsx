'use client';

import { useEffect, useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import type { FloorViewTowerConfig, FloorViewTypeConfig } from '@/lib/tour-types';

/**
 * Vista del apto a todo el espacio disponible, con la planta (PNG/WebP transparente)
 * montada en la esquina inferior derecha de la foto. Tocar la planta la agranda.
 * Si la vista falta o no carga, se muestra "Próximamente".
 */
function ViewWithPlan({ view, plan, alt }: { view?: string; plan?: string; alt: string }) {
  // Se guarda el src que fallo: al cambiar de imagen el estado se "resetea" solo.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [failedPlan, setFailedPlan] = useState<string | null>(null);
  const [ratio, setRatio] = useState(16 / 9);
  const [planBig, setPlanBig] = useState(false);
  const failed = !view || failedSrc === view;
  const showPlan = plan && failedPlan !== plan;

  return (
    // container-type: size -> el marco usa cqw/cqh para ocupar el maximo sin deformar la foto
    <div className="relative w-full h-full min-h-0 flex items-center justify-center" style={{ containerType: 'size' }}>
      {!failed ? (
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            width: `min(100cqw, calc(100cqh * ${ratio}))`,
            aspectRatio: String(ratio),
            boxShadow: '0 18px 60px rgba(0,0,0,0.65)',
          }}
        >
          <img
            key={view}
            src={view}
            alt={alt}
            onError={() => setFailedSrc(view)}
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (w && h) setRatio(w / h);
            }}
            draggable={false}
            className="fv-fade absolute inset-0 w-full h-full object-cover select-none"
          />
          {showPlan && (
            <button
              type="button"
              onClick={() => setPlanBig((b) => !b)}
              aria-label={planBig ? 'Reducir planta' : 'Ampliar planta'}
              title={planBig ? 'Reducir planta' : 'Ampliar planta'}
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 transition-all duration-300 ease-out"
              style={{ width: planBig ? '62%' : '30%', cursor: planBig ? 'zoom-out' : 'zoom-in', background: 'none', border: 'none', padding: 0 }}
            >
              <img
                src={plan}
                alt="Planta del piso con el apartamento resaltado"
                onError={() => setFailedPlan(plan)}
                draggable={false}
                className="w-full h-auto select-none"
                style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.55))' }}
              />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center px-4 select-none">
          <p className="text-[12px] tracking-widest uppercase" style={{ color: 'rgba(255, 255, 255,0.5)' }}>
            Próximamente
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(255, 255, 255,0.3)' }}>
            La vista de este apartamento se agregará pronto.
          </p>
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255, 255, 255,0.25)',
  color: '#FFFFFF', background: 'rgba(10, 10, 10,0.6)', cursor: 'pointer',
} as const;

/**
 * Pantalla completa de "Vistas Pisos" para una torre y un tipo (elegidos en el
 * menu lateral: Torre > Tipo A / Tipo B). Pisos y aptos quedan en la esquina
 * izquierda; el resto muestra la vista del apto seleccionado con su planta.
 */
export default function FloorViewModal({ tower, type, onClose }: {
  tower: FloorViewTowerConfig;
  type: FloorViewTypeConfig;
  onClose: () => void;
}) {
  const [unitId, setUnitId] = useState<string | null>(null);
  const [floor, setFloor] = useState(1);

  const unit = type.units.find((u) => u.id === unitId) ?? type.units[0];
  /** Nombre del apto en un piso: piso + numero base ('02' en piso 3 -> '302'). */
  const aptName = (number: string, p = floor) => `${p}${number}`;
  const floors = Array.from({ length: tower.floors }, (_, i) => i + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vistas ${tower.label}`}
      className="fv-fade fixed inset-0 z-[10001]"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10, 10, 10,0.94) 0%, rgba(0,0,0,0.98) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#FFFFFF',
      }}
    >
      <style>{`
        @keyframes fv-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fv-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .fv-fade { animation: fv-fade-in 0.3s ease both; }
        .fv-rise { animation: fv-rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <button onClick={onClose} aria-label="Cerrar vistas" className="absolute top-3 right-3 z-10 flex items-center justify-center" style={iconBtn}>
        <X size={16} />
      </button>

        {/* Aptos en la esquina izquierda + vista y planta */}
        <div className="h-full flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 pt-14 md:pt-4">
          {/* Sin contenedor: cada boton flota por separado sobre el fondo */}
          <aside className="shrink-0 md:w-44 flex flex-col gap-3 self-start md:max-h-full max-w-full">
            <button
              onClick={onClose}
              aria-label="Volver al recorrido"
              className="flex items-center gap-2 px-1 py-1 text-left"
              style={{ cursor: 'pointer', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
            >
              <ArrowLeft size={14} style={{ opacity: 0.7 }} />
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold tracking-widest uppercase truncate">{tower.label}</span>
                <span className="block text-[10px] tracking-wider uppercase" style={{ color: 'rgba(255, 255, 255,0.5)' }}>{type.label}</span>
              </span>
            </button>
            {/* Piso: circulos flotantes (grilla 4×3 en desktop, fila deslizable en movil) */}
            <div className="px-1">
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255, 255, 255,0.5)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                Piso
              </p>
              <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto p-1 -m-1" role="radiogroup" aria-label="Piso">
                {floors.map((p) => {
                  const active = p === floor;
                  return (
                    <button
                      key={p}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFloor(p)}
                      className="shrink-0 flex items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        width: 34,
                        height: 34,
                        color: active ? '#1C2430' : 'rgba(255, 255, 255,0.85)',
                        background: active ? '#FFFFFF' : 'rgba(20, 20, 20,0.55)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: active ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255,0.14)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="hidden md:block px-1 -mb-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255, 255, 255,0.5)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              Apartamentos
            </p>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto p-1">
              {type.units.map((u) => {
                const active = u.id === unit?.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setUnitId(u.id)}
                    aria-pressed={active}
                    className="shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-full text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      color: active ? '#1C2430' : 'rgba(255, 255, 255,0.85)',
                      background: active ? '#FFFFFF' : 'rgba(20, 20, 20,0.55)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: active ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255,0.14)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="text-[12px] font-semibold tracking-wider uppercase whitespace-nowrap">Apto {aptName(u.number)}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {unit && (
            <section className="flex-1 min-w-0 min-h-0 flex flex-col">
              <div className="mb-3 md:pr-12">
                <h2 className="text-[14px] font-semibold tracking-widest uppercase">Vista Apto {aptName(unit.number)}</h2>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255, 255, 255,0.55)' }}>{tower.label} · Piso {floor} · {type.label}</p>
              </div>
              <div className="flex-1 min-h-0">
                <ViewWithPlan
                  view={unit.views[floor - 1]}
                  plan={unit.plan ?? type.plan}
                  alt={`Vista apto ${aptName(unit.number)} — ${tower.label}`}
                />
              </div>
            </section>
          )}
        </div>
    </div>
  );
}
