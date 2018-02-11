defmodule Mfac.Meetings.Proposal do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Proposal


  schema "proposals" do
    field :decided_at, :utc_datetime 
    field :deleted_at, :utc_datetime
    field :description, :string
    field :meeting_action, :string
    field :status, :string, default: "PENDING"
    field :title, :string
    field :version, :integer, default: 0
    belongs_to :agenda_item, Mfac.Meetings.AgendaItem
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    has_many :proposal_votes, Mfac.Meetings.ProposalVote
    has_many :votes, through: [:proposal_votes, :vote]
    has_many :amendments, Mfac.Meetings.Amendment, on_delete: :nothing

    timestamps()
  end

  @doc false
  def changeset(%Proposal{} = proposal, attrs) do
    proposal
    |> cast(attrs, [:title, :description, :status, :version, :decided_at, :meeting_action, :user_id, :agenda_item_id])
    |> validate_required([:title, :description, :status, :version, :meeting_action, :user_id, :agenda_item_id])
  end
end
