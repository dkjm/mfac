defmodule Mfac.Meetings.Vote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Vote


  schema "votes" do
    field :value, :integer, default: 0
    field :version, :integer, default: 0
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id

    timestamps()
  end

  @doc false
  def changeset(%Vote{} = vote, attrs) do
    vote
    |> cast(attrs, [:value, :version, :user_id])
    |> validate_required([:value, :version])
  end
end
