defmodule Mfac.Repo.Migrations.CreateAmendmentVotes do
  use Ecto.Migration

  def change do
    create table(:amendment_votes) do
      add :vote_id, references(:votes, on_delete: :nothing)
      add :amendment_id, references(:amendments, on_delete: :nothing)

      timestamps()
    end

    create index(:amendment_votes, [:vote_id])
    create index(:amendment_votes, [:amendment_id])
  end
end
