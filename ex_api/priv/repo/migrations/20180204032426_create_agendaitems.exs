defmodule Mfac.Repo.Migrations.CreateAgendaitems do
  use Ecto.Migration

  def change do
    create table(:agendaitems) do
      add :title, :string
      add :body, :string
      add :status, :string
      add :allotted_duration, :integer
      add :version, :integer
      add :closed_at, :utc_datetime
      add :user_id, references(:users, on_delete: :nothing)
      add :meeting_id, references(:meetings, on_delete: :nothing)

      timestamps()
    end

  end
end
