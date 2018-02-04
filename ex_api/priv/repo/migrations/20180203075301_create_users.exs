defmodule Mfac.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :first_name, :string
      add :last_name, :string
      add :middle_name, :string
      add :suffix, :string
      add :is_active, :boolean, default: false, null: false

      timestamps()
    end

  end
end

