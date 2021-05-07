/*
  This should be used when we know for sure that a type has been created
*/
import PersistantObject from "./PersistantObject";

export default interface PersistedObject extends Omit<PersistantObject, 'id' | 'createdAt' | 'updatedAt'> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}