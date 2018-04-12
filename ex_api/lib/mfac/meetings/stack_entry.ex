defmodule Mfac.Meetings.StackEntry do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.StackEntry


  schema "stack_entries" do
    field :allotted_duration, :integer
    field :closed_at, :utc_datetime
    field :opened_at, :utc_datetime
    field :status, :string, default: "PENDING"
    field :version, :integer, default: 0
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    belongs_to :agenda_item, Mfac.Meetings.AgendaItem, foreign_key: :agenda_item_id

    timestamps()
  end

  @doc false
  def changeset(%StackEntry{} = stack_entry, attrs) do
    stack_entry
    |> cast(attrs, [:agenda_item_id, :user_id, :status, :allotted_duration, :version, :opened_at, :closed_at])
    |> validate_required([:agenda_item_id, :user_id])
  end
end
