defmodule Mfac.Repo.Migrations.CreateProposals do
  use Ecto.Migration

  def change do
    create table(:proposals) do
      add :title, :string
      add :description, :text
      add :status, :string, default: "PENDING"
      add :version, :integer, default: 0
      add :decided_at, :utc_datetime
      add :deleted_at, :utc_datetime
      add :meeting_action, :string
      add :agenda_item_id, references(:agenda_items, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:proposals, [:agenda_item_id])
  end
end
