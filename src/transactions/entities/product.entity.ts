import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'product_id', unique: true })
  productId: string;

  @Column({ type: 'integer' })
  price: number;
}
