import { PrimaryKey, Property, Entity, EntityData } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import IPersistentObject from "@shared/models/IPersistentObject";

// We can't make this implement IPersistedObject because
// orm.em.create(EntityType, {}) will return an EntityType that does not have
// an id, createdAt or updatedAt defined until a flush is called. 
@ObjectType()
@Entity({ abstract: true })
export abstract class PersistentEntity implements IPersistentObject {
  @Field(() => Int)
  @PrimaryKey({nullable: false})
  id!: number;

  @Field(() => String)
  @Property({ columnType: 'timestamptz', nullable: false})
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ columnType: 'timestamptz', nullable: false, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}