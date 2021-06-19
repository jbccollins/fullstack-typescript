import { Field, Int, ObjectType } from 'type-graphql';
import IPersistentObject from '@shared/models/IPersistentObject';
import { PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

// We can't make this implement IPersistedObject because
// orm.em.create(EntityType, {}) will return an EntityType that does not have
// an id, createdAt or updatedAt defined until a flush is called.
@ObjectType()
@Entity()
export abstract class PersistentEntity extends BaseEntity implements IPersistentObject {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
