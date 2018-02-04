defmodule Mfac.Repo.Migrations.CreateAgendaitemvotes do
  use Ecto.Migration

  def change do
    create table(:agenda_item_votes) do
      add :vote_type, :string
      add :version, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :agenda_item_id, references(:agenda_items, on_delete: :delete_all)

      timestamps()
    end

  end
end
