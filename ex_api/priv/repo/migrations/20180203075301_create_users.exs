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

    alter table(:topics) do
      add :user_id, references(:users, on_delete: :nothing)
    end

    alter table(:topic_comments) do
      add :user_id, references(:users, on_delete: :nothing)
    end

    alter table(:stacks) do
      add :user_id, references(:users, on_delete: :nothing)
    end

  end
end

