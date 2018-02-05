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
    belongs_to :agenda_item, Mfac.Meetings.AgendaItem, foreign_key: :agenda_item_id

    timestamps()
  end

  @doc false
  def changeset(%StackEntry{} = stack_entry, attrs) do
    stack_entry
    |> cast(attrs, [:agenda_item_id, :status, :allotted_duration, :version, :opened_at, :closed_at])
    |> validate_required([:status, :allotted_duration, :version, :opened_at, :closed_at])
  end
end
