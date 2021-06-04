/*
  This should be used when we know for sure that a type has been created
*/
//import IPersistentObject from '@shared/models/IPersistentObject';

export default interface IPersistedObject {//extends Omit<IPersistentObject, 'id' | 'createdAt' | 'updatedAt'> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
