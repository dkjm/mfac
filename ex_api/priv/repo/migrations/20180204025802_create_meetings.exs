defmodule Mfac.Repo.Migrations.CreateMeetings do
  use Ecto.Migration

  def change do
    create table(:meetings) do
      add :title, :string
      add :description, :string
      add :allotted_duration, :integer, default: 0
      add :version, :integer, default: 0
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

  end
end
