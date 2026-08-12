export class OcrProvider {
  constructor(name){this.name=name}
  async extract(){throw new Error(`${this.name} provider is not configured`)}
}

export function createProvider(name,extract){
  if(typeof extract!=='function') throw new TypeError('OCR provider requires an extract function');
  return {name,extract};
}
