export interface Product {

  id:string;

  name:string;

  slug:string;

  price:number;

  oldPrice?:number;

  image:string;

  category:string;

  rating:number;

  badge?:string;


  // SEO
  shortDescription?:string;

  description?:string;


  // ویژگی‌ها
  features?:string[];


  // نظرات
  reviews?: Review[];

}
export interface Review {

  id:string;

  name:string;

  comment:string;

  createdAt:string;

  rating:number;

}
