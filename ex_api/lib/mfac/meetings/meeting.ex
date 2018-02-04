defmodule Mfac.Meetings.Meeting do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Meeting


  schema "meetings" do
    field :title, :string
    field :description, :string
    field :allotted_duration, :integer
    field :version, :integer
    field :ended_on, :utc_datetime
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id

    timestamps()
  end

  @doc false
  def changeset(%Meeting{} = meeting, attrs) do
    meeting
    |> cast(attrs, [:title, :description, :allotted_duration, :version, :user_id])
    |> validate_required([:title, :description, :allotted_duration, :version])
  end
end
