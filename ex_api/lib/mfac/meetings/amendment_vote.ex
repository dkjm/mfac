defmodule Mfac.Meetings.AmendmentVote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.AmendmentVote


  schema "amendment_votes" do
    belongs_to :amendment, Mfac.Meetings.Amendment
    belongs_to :vote, Mfac.Meetings.Vote

    timestamps()
  end

  @doc false
  def changeset(%AmendmentVote{} = amendment_vote, attrs) do
    amendment_vote
    |> cast(attrs, [:amendment_id, :vote_id])
    |> validate_required([:amendment_id, :vote_id])
  end
end
