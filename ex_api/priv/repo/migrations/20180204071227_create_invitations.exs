defmodule Mfac.Repo.Migrations.CreateInvitations do
  use Ecto.Migration

  def change do
    create table(:invitations) do
      add :status, :string
      add :accepted_at, :utc_datetime
      add :declined_at, :utc_datetime
      add :version, :integer
      add :inviter_id, references(:users, on_delete: :nothing)
      add :invitee_id, references(:users, on_delete: :nothing)
      add :meeting_id, references(:meetings, on_delete: :nothing)

      timestamps()
    end

    create index(:invitations, [:inviter_id])
    create index(:invitations, [:invitee_id])
    create index(:invitations, [:meeting_id])
  end
end
