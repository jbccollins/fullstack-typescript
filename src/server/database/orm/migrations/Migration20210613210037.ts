import { Migration } from '@mikro-orm/migrations';

export class Migration20210613210037 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" text not null, "last_name" text not null, "email" text not null, "username" text null, "pwd_hash" text not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
