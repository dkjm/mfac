defmodule Mfac.Meetings.AgendaItemVote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.AgendaItemVote


  schema "agendaitemvotes" do
    field :version, :integer
    field :vote_type, :string
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    belongs_to :agendaitem, Mfac.Meetings.AgendaItem, foreign_key: :agendaitem_id

    timestamps()
  end

  @doc false
  def changeset(%AgendaItemVote{} = agenda_item_vote, attrs) do
    agenda_item_vote
    |> cast(attrs, [:vote_type, :version, :user_id, :agendaitem_id])
    |> validate_required([:vote_type, :version])
  end
end
