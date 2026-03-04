// src/types/shared.d.ts
// Type declaration for the shared UI package

declare module '@orenuki/dh-reporting-shared' {
  export const appStyleConstants: {
    // Colors
    COLOR_PRIMARY: string;
    COLOR_DARKER: string;
    COLOR_DARK: string;
    COLOR_SURFACE: string;
    COLOR_SURFACE_LIGHT: string;
    COLOR_BORDER: string;
    COLOR_WHITE: string;
    COLOR_ERROR: string;
    COLOR_TEXT: string;
    COLOR_TEXT_LIGHT: string;
    COLOR_TEXT_MUTED: string;
    COLOR_TEXT_SUBTLE: string;

    // Font sizes
    FONT_SIZE_10: number;
    FONT_SIZE_12: number;
    FONT_SIZE_14: number;
    FONT_SIZE_15: number;
    FONT_SIZE_16: number;
    FONT_SIZE_18: number;
    FONT_SIZE_20: number;
    FONT_SIZE_24: number;

    // Font weights
    FONT_WEIGHT_MEDIUM: string;
    FONT_WEIGHT_SEMIBOLD: string;

    // Font families
    FONT_FAMILY_MONTSERRAT: string;

    // Sizes
    SIZE_2: number;
    SIZE_4: number;
    SIZE_6: number;
    SIZE_8: number;
    SIZE_10: number;
    SIZE_12: number;
    SIZE_16: number;
    SIZE_20: number;
    SIZE_24: number;
    SIZE_32: number;
    SIZE_40: number;
    SIZE_48: number;
    SIZE_64: number;

    // Radius
    RADIUS_SMALL: number;
    RADIUS_MEDIUM: number;
    RADIUS_LARGE: number;

    // Composite styles
    STYLE_BODY: object;

    // Allow additional properties
    [key: string]: any;
  };
}
