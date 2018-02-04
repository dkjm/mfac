defmodule Mfac.Meetings.StackEntry do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.StackEntry


  schema "stack_entries" do
    field :allotted_duration, :integer
    field :closed_at, :utc_datetime
    field :opened_at, :utc_datetime
    field :status, :string
    field :version, :integer
    field :user_id, :id
    field :agenda_item_id, :id

    timestamps()
  end

  @doc false
  def changeset(%StackEntry{} = stack_entry, attrs) do
    stack_entry
    |> cast(attrs, [:status, :allotted_duration, :version, :opened_at, :closed_at])
    |> validate_required([:status, :allotted_duration, :version, :opened_at, :closed_at])
  end
end
