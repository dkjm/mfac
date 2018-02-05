defmodule Mfac.Repo.Migrations.CreateParticipants do
  use Ecto.Migration

  def change do
    create table(:participants) do
      add :status, :string
      add :joined_at, :utc_datetime
      add :left_at, :utc_datetime
      add :version, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :meeting_id, references(:meetings, on_delete: :nothing)

      timestamps()
    end

    create index(:participants, [:user_id])
    create index(:participants, [:meeting_id])
  end
end
