# Vistas por piso

Imágenes del botón **Vistas Pisos** del menú lateral. 4 torres × 12 pisos × 8 aptos.
El nombre del apto es piso + número base de la planta (02 → 102, 202 … 1202):

```
torre-1/apto-101.jpg … apto-108.jpg   (piso 1)
torre-1/apto-201.jpg … apto-208.jpg   (piso 2)
…
torre-1/apto-1201.jpg … apto-1208.jpg (piso 12)
torre-2/…  torre-3/…  torre-4/…
```

Si una imagen falta, el pop-up muestra "Próximamente". La planta sale de
`floor-plans/planta-tipo-x-areas.jpg`. Qué números son Tipo A / Tipo B se
cambia en `VISTA_UNITS` de `src/projects/melendez/portal-del-rio/tour.config.ts`.
