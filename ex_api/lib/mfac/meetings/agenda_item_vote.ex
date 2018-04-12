defmodule Mfac.Meetings.AgendaItemVote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.AgendaItemVote


  schema "agenda_item_votes" do
    field :version, :integer, default: 0
    field :vote_type, :string
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    belongs_to :agenda_item, Mfac.Meetings.AgendaItem, foreign_key: :agenda_item_id

    timestamps()
  end

  @doc false
  def changeset(%AgendaItemVote{} = agenda_item_vote, attrs) do
    agenda_item_vote
    |> cast(attrs, [:vote_type, :user_id, :agenda_item_id])
    |> validate_required([:vote_type, :user_id, :agenda_item_id])
  end
end
