// El Builder concreto que sabe cómo construir el Producto
export class CustomTshirtBuilder {
    private product: Product;

    constructor() {
        this.product = new Product();
    }

    public reset(): void {
        this.product = new Product();
    }

    public setGarment(garment: TShirt): this {
        this.product.baseGarment = garment;
        return this;
    }

    public addPrint(print: Print): this {
        this.product.prints.push(print);
        return this;
    }

    public setSize(size: TShirtSize): this {
        this.product.size = size;
        return this;
    }
    
    public build(): Product {
        const finalProduct = this.product;
        this.reset();
        return finalProduct;
    }
}


// --- Uso en el Cliente: frontend/src/pages/CustomizePage.tsx ---

const CustomizePage = () => {
    // Se crea una instancia del builder que persiste durante la vida del componente
    const [builder] = useState(() => new CustomTshirtBuilder());

    // El cliente invoca pasos en diferentes momentos de la UI
    useEffect(() => {
        if (selectedVariant) {
            builder.setGarment(selectedVariant);
        }
    }, [selectedVariant, builder]);

    // El cliente finaliza la construcción y obtiene el producto cuando es necesario
    const handleFinalAction = async () => {
        // Se orquestan los últimos pasos y se llama a build()
        const productData = builder
            .setSize(selectedSize)
            .setQuantity(quantity)
            .build();

        // "productData" ya es el objeto complejo y listo para ser usado
        // ...
    };
    
    // ...
};