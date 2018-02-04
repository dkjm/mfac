defmodule Mfac.Repo.Migrations.CreateAgendaitemvotes do
  use Ecto.Migration

  def change do
    create table(:agendaitemvotes) do
      add :vote_type, :string
      add :version, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :agendaitem_id, references(:agendaitems, on_delete: :delete_all)

      timestamps()
    end

  end
end
