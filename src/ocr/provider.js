/** Provider contract for CourtIQ OCR engines.
 *
 * Implementations can wrap PaddleOCR, a hosted vision model, or another OCR
 * engine without coupling the verification/analytics layer to that provider.
 */

export class OCRProvider {
  constructor({ name = 'unknown', version = 'unknown' } = {}) {
    this.name = name;
    this.version = version;
  }

  async extract(_image, _context = {}) {
    throw new Error(`${this.name} OCR provider has no implementation`);
  }
}

export function normalizeProviderResult(result, context = {}) {
  return {
    fixtureId: context.fixtureId ?? null,
    screenshotId: context.screenshotId ?? null,
    engine: result.engine ?? 'unknown',
    engineVersion: result.engineVersion ?? 'unknown',
    rawText: result.rawText ?? result.text ?? '',
    blocks: Array.isArray(result.blocks) ? result.blocks : [],
    candidates: Array.isArray(result.candidates) ? result.candidates : [],
    status: 'review',
    verified: false,
  };
}
