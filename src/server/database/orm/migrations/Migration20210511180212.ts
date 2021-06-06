import { Migration } from '@mikro-orm/migrations';

export class Migration20210511180212 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "User" ("id" serial primary key, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "firstName" text not null, "lastName" text not null, "email" text not null, "pwdHash" text not null);',
    );
    this.addSql('alter table "User" add constraint "User_email_unique" unique ("email");');
  }
}
