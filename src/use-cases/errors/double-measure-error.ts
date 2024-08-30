export class DoubleMeasureError extends Error {
  constructor() {
    super("Leitura do mês já realizada");
  }
}
