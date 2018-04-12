defmodule Mfac.Repo.Migrations.CreateAmendments do
  use Ecto.Migration

  def change do
    create table(:amendments) do
      add :title, :string
      add :description, :text
      add :version, :integer, default: 0
      add :decided_at, :utc_datetime
      add :deleted_at, :utc_datetime
      add :meeting_action, :string
      add :status, :string, default: "PENDING"
      add :user_id, references(:users, on_delete: :nothing)
      add :proposal_id, references(:proposals, on_delete: :nothing)

      timestamps()
    end

    create index(:amendments, [:proposal_id])
  end
end
