defmodule Mfac.Repo.Migrations.CreateStack do
  use Ecto.Migration

  def change do
    create table(:stacks) do
      add :version, :integer

      timestamps()
    end

  end
end
