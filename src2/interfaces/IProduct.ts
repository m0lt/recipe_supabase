import type { ICategory } from "./ICategory";

export interface IProduct {
    id: number,
    title?: string,
    price?: number,
    quality?: string,
    category: ICategory
}