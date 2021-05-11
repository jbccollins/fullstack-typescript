import { MikroORM, IDatabaseDriver, Connection, Entity, EntityName, EntityData, AnyEntity, Populate } from "@mikro-orm/core";

/*
  create, persiste and flush all in the same async function.
*/
export class CustomEntityManager {
  static async createAndSave<T extends AnyEntity<T>, P extends Populate<T> = any>(orm: MikroORM<IDatabaseDriver<Connection>>, entityName: EntityName<T>, data: EntityData<T>, options?: {
    managed?: boolean;
  }): Promise<T> {
    /****** Kinda bad hacky stuff *****/
    /*
      const userEntityData: IUserEntity = {
        firstName: "DERP",
        lastName: "TERP",
        email: "herp@berp.com",
        pwdHash: "asdfasdfas",
      }
      // We can't yet know the required id, createdAt and updatedAt fields so we use
      // IUserEntity here instead of just User.
      const userEntity: IUserEntity = orm.em.create(User, userEntityData) as IUserEntity;
      await orm.em.persistAndFlush(userEntity);
      // And cast it here to the User type which guarentees that the required fields actually exist.
      const user = userEntity as User;
    */

    
    /***** Alternative *****/
    // To avoid all that we do the create, persist and flush all at once in the same function.
    // const user: User = await CustomEntityManager.createAndSave(orm, User, userEntityData);
    const entity = orm.em.create(entityName, data, options);
    await orm.em.persistAndFlush(entity);
    return entity;
  };
}