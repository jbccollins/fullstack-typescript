export interface IPost {
  title: string;
  text: string;
  points: number;
  authorId: number;
}

export interface IPostPersistent extends IPost, IPersistentObject {}

export interface IPostPersisted extends IPost, IPersistedObject {}
