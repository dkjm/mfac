defmodule Mfac.Meetings.Invitation do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Invitation


  schema "invitations" do
    field :accepted_at, :utc_datetime
    field :declined_at, :utc_datetime
    field :status, :string
    field :version, :integer, default: 0
    belongs_to :inviter, Mfac.Accounts.User, foreign_key: :inviter_id
    belongs_to :invitee, Mfac.Accounts.User, foreign_key: :invitee_id
    belongs_to :meeting, Mfac.Meetings.Meeting

    timestamps()
  end

  @doc false
  def changeset(%Invitation{} = invitation, attrs) do
    invitation
    |> cast(attrs, [:status, :accepted_at, :declined_at, :version, :inviter_id, :invitee_id, :meeting_id])
    |> validate_required([:meeting_id, :inviter_id, :invitee_id, :status, :version])
  end
end
