import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { Field, Int } from "type-graphql";
import IPersistantObject from "@shared/models/IPersistantObject";

// We can't make this implement IPersistedObject because
// orm.em.create(EntityType, {}) will return an EntityType that does not have
// an id, createdAt or updatedAt defined until a flush is called. 
@Entity({ abstract: true })
export abstract class BaseEntity implements IPersistantObject {
  @Field(() => Int)
  @PrimaryKey({nullable: false})
  id!: number;

  @Field(() => String)
  @Property({nullable: false})
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ nullable: false, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}