defmodule Mfac.Meetings.ProposalVote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.ProposalVote


  schema "proposal_votes" do
    belongs_to :proposal, Mfac.Meetings.Proposal
    belongs_to :vote, Mfac.Meetings.Vote

    timestamps()
  end

  @doc false
  def changeset(%ProposalVote{} = proposal_vote, attrs) do
    proposal_vote
    |> cast(attrs, [:proposal_id, :vote_id])
    |> validate_required([:proposal_id, :vote_id])
  end
end
