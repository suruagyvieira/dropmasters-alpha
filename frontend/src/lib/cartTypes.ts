
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    metadata?: any; // Flexible metadata for custom items
}
