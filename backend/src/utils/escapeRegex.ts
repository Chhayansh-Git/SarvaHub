/**
 * Escapes special regex characters in a string to prevent
 * ReDoS (Regular Expression Denial of Service) attacks.
 *
 * Must be applied to ANY user input before using it in a $regex query.
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
