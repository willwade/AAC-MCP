import { findSystemProfile } from "../../data/aacSystems.js";
import type { GridSize } from "./customPages.js";

export const clampGridToSystem = (
    desiredGrid: GridSize,
    systemName: string | undefined,
): { grid: GridSize; compatibilityNotes: string[] } => {
    const profile = findSystemProfile(systemName);
    if (!profile) return { grid: desiredGrid, compatibilityNotes: [] };

    const clamped = {
        rows: Math.max(profile.gridRange.minRows, Math.min(profile.gridRange.maxRows, desiredGrid.rows)),
        columns: Math.max(profile.gridRange.minColumns, Math.min(profile.gridRange.maxColumns, desiredGrid.columns)),
    };

    const notes: string[] = [];

    if (clamped.rows !== desiredGrid.rows || clamped.columns !== desiredGrid.columns) {
        notes.push(
            `${profile.system}: adjusted grid to ${clamped.rows}x${clamped.columns} (supports rows ${profile.gridRange.minRows}-${profile.gridRange.maxRows}, columns ${profile.gridRange.minColumns}-${profile.gridRange.maxColumns}).`,
        );
    }

    return { grid: clamped, compatibilityNotes: notes };
};
