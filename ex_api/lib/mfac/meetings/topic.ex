defmodule Mfac.Meetings.Topic do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Topic


  schema "topics" do
    field :body, :string
    field :title, :string
    field :version, :integer

    timestamps()
  end

  @doc false
  def changeset(%Topic{} = topic, attrs) do
    topic
    |> cast(attrs, [:title, :body, :version])
    |> validate_required([:title, :body, :version])
  end
end
