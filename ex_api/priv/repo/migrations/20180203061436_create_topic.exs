defmodule Mfac.Repo.Migrations.CreateTopic do
  use Ecto.Migration

  def change do
    create table(:topics) do
      add :title, :string
      add :body, :text
      add :version, :integer

      timestamps()
    end

  end
end
