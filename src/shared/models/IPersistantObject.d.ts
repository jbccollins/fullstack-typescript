/*
  This should be used when we either know for sure that a type
  hasn't been created or are unsure if it has been created.
*/
export default interface IPersistantObject {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
