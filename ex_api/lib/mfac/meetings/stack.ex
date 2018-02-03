defmodule Mfac.Meetings.Stack do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Stack


  schema "stacks" do
    field :version, :integer

    timestamps()
  end

  @doc false
  def changeset(%Stack{} = stack, attrs) do
    stack
    |> cast(attrs, [:version])
    |> validate_required([:version])
  end
end
