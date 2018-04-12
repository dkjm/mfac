defmodule Mfac.Meetings.Amendment do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Amendment


  schema "amendments" do
    field :decided_at, :utc_datetime
    field :deleted_at, :utc_datetime
    field :description, :string
    field :meeting_action, :string
    field :status, :string, default: "PENDING"
    field :title, :string
    field :version, :integer, default: 0
    belongs_to :proposal, Mfac.Meetings.Proposal
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    has_many :amendment_votes, Mfac.Meetings.AmendmentVote
    has_many :votes, through: [:amendment_votes, :vote]

    timestamps()
  end

  @doc false
  def changeset(%Amendment{} = amendment, attrs) do
    amendment
    |> cast(attrs, [:title, :description, :version, :decided_at, :meeting_action, :status, :user_id, :proposal_id])
    |> validate_required([:title, :description, :version, :meeting_action, :status, :user_id, :proposal_id])
  end
end
