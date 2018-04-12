defmodule Mfac.Repo.Migrations.AddUserNameToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :user_name, :string
    end
  end
end
