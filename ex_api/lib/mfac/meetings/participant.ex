defmodule Mfac.Meetings.Participant do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Participant


  schema "participants" do
    field :joined_at, :utc_datetime
    field :left_at, :utc_datetime
    field :status, :string
    field :version, :integer, default: 0
    belongs_to :user, Mfac.Accounts.User 
    belongs_to :meeting, Mfac.Meetings.Meeting 

    timestamps()
  end

  @doc false
  def changeset(%Participant{} = participant, attrs) do
    participant
    |> cast(attrs, [:status, :joined_at, :left_at, :version, :user_id, :meeting_id])
    |> validate_required([:status, :joined_at, :left_at, :version])
  end
end
