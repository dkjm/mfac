defmodule Mfac.Meetings.Topic do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.Topic


  schema "topics" do
    field :body, :string
    field :title, :string
    field :version, :integer
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id
    has_many :topic_comments, Mfac.Meetings.TopicComment

    timestamps()
  end

  @doc false
  def changeset(%Topic{} = topic, attrs) do
    topic
    |> cast(attrs, [:title, :body, :version, :user_id])
    |> validate_required([:title, :body, :version])
  end
end
