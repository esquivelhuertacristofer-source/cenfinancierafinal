/**
 * @file accessibility.ts
 * @description Utilidades de accesibilidad para cumplimiento WCAG 2.1
 */

export interface AriaLabel {
    role: string;
    ariaLabel: string;
    ariaDescribedBy?: string;
}

/**
 * Genera atributos de accesibilidad para botones
 */
export const buttonAria = (label: string, describedBy?: string): Record<string, string> => ({
    role: 'button',
    'aria-label': label,
    ...(describedBy && { 'aria-describedby': describedBy }),
});

/**
 * Genera atributos de accesibilidad para navegación
 */
export const navAria = (label: string): Record<string, string> => ({
    role: 'navigation',
    'aria-label': label,
});

/**
 * Genera atributos de accesibilidad para regiones Live (para actualizaciones dinámicas)
 */
export const liveRegionAria = (label: string, polite = true): Record<string, string> => ({
    role: 'status',
    'aria-live': polite ? 'polite' : 'assertive',
    'aria-atomic': 'true',
});

/**
 * Genera atributos de accesibilidad para formularios
 */
export const formFieldAria = (label: string, required = false, errorId?: string): Record<string, string> => ({
    'aria-label': label,
    ...(required && { 'aria-required': 'true' }),
    ...(errorId && { 'aria-describedby': errorId, 'aria-invalid': 'true' }),
});

/**
 * Skip link para navegación por teclado
 */
export const skipLinkStyles = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #0980E8;
        color: white;
        padding: 8px 16px;
        z-index: 100;
        transition: top 0.3s;
    }
    .skip-link:focus {
        top: 0;
    }
`;
