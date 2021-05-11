/*
  This should be used when we know for sure that a type has been created
*/
//import IPersistantObject from '@shared/models/IPersistantObject';

export default interface IPersistedObject {//extends Omit<IPersistantObject, 'id' | 'createdAt' | 'updatedAt'> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
