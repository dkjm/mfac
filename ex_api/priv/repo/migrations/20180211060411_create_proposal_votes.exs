defmodule Mfac.Repo.Migrations.CreateProposalVotes do
  use Ecto.Migration

  def change do
    create table(:proposal_votes) do
      add :proposal_id, references(:proposals, on_delete: :nothing)
      add :vote_id, references(:votes, on_delete: :nothing)

      timestamps()
    end

    create index(:proposal_votes, [:proposal_id])
    create index(:proposal_votes, [:vote_id])
  end
end
