defmodule Mfac.Repo.Migrations.CreateStackEntries do
  use Ecto.Migration

  def change do
    create table(:stack_entries) do
      add :status, :string
      add :allotted_duration, :integer
      add :version, :integer
      add :opened_at, :utc_datetime
      add :closed_at, :utc_datetime
      add :user_id, references(:users, on_delete: :nothing)
      add :agenda_item_id, references(:agenda_items, on_delete: :nothing)

      timestamps()
    end

    create index(:stack_entries, [:user_id])
    create index(:stack_entries, [:agenda_item_id])
  end
end
