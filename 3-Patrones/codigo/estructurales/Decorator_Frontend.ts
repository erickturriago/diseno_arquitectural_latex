// --- Definición del Patrón en: frontend/src/patterns/decorator/PriceDecorator.ts ---

// La interfaz Componente, que define la operación común.
export interface PricedItem {
  getPrice(): number;
  getDescription(): string;
}

// El Componente Concreto: el objeto base inicial.
export class BaseGarmentPrice implements PricedItem {
  constructor(private garment: TShirt) {}

  public getPrice(): number {
    return this.garment.price;
  }
  public getDescription(): string {
    return this.garment.name;
  }
}

// El Decorador Concreto: añade una responsabilidad (el costo de una estampa).
export class PrintPriceDecorator implements PricedItem {
  constructor(private wrappedItem: PricedItem, private print: Print) {}

  public getPrice(): number {
    // Delega la llamada al objeto envuelto y añade su propio costo.
    return this.wrappedItem.getPrice() + this.print.price;
  }

  public getDescription(): string {
    // Delega la descripción y añade la suya.
    return `${this.wrappedItem.getDescription()} + Estampa: ${this.print.title}`;
  }
}


// --- Uso en el Cliente: frontend/src/pages/CustomizePage.tsx ---

function calculateFinalPrice(baseGarment: TShirt, addedPrints: Print[]): number {
  // 1. Se crea el objeto base con el precio inicial.
  let pricedItem: PricedItem = new BaseGarmentPrice(baseGarment);

  // 2. Se itera sobre las adiciones y se "decora" el objeto por cada una.
  for (const print of addedPrints) {
    // Cada nueva decoración envuelve a la anterior.
    pricedItem = new PrintPriceDecorator(pricedItem, print);
  }

  // 3. Al llamar a getPrice(), la llamada se delega a través de toda la cadena.
  console.log('Descripción final:', pricedItem.getDescription());
  return pricedItem.getPrice();
}