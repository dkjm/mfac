defmodule Mfac.Meetings.AgendaItem do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.AgendaItem


  schema "agenda_items" do
    field :allotted_duration, :integer
    field :body, :string
    field :status, :string
    field :title, :string
    field :version, :integer, default: 0
    field :closed_at, :utc_datetime
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    belongs_to :meeting, Mfac.Meetings.Meeting, foreign_key: :meeting_id
    has_many :votes, Mfac.Meetings.AgendaItemVote
    timestamps()
  end

  @doc false
  def changeset(%AgendaItem{} = agenda_item, attrs) do
    agenda_item
    |> cast(attrs, [:title, :body, :status, :allotted_duration, :version, :user_id, :meeting_id])
    |> validate_required([:title, :body, :version])
  end
end
