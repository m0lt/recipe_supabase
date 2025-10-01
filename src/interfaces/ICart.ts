import type { IProduct } from "./IProduct";

export interface ICart {
    id: number,
    cart_id: number,
    quantity: number,
    products: IProduct[]
}