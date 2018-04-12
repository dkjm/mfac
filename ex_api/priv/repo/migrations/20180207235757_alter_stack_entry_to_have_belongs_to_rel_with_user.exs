defmodule Mfac.Repo.Migrations.AlterStackEntryToHaveBelongsToRelWithUser do
  use Ecto.Migration

  def change do
  	alter table(:stack_entries) do
      remove :user_id
      add :user_id, references(:users, on_delete: :delete_all)
    end
  end
end
