defmodule Mfac.Meetings.TopicComment do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Meetings.TopicComment


  schema "topic_comments" do
    field :body, :string
    field :version, :integer
    field :parent_topic_coment_id, :id
    belongs_to :topic, Mfac.Meetings.Topic
    belongs_to :owner, Mfac.Accounts.User, foreign_key: :user_id

    timestamps()
  end

  @doc false
  def changeset(%TopicComment{} = topic_comment, attrs) do
    topic_comment
    |> cast(attrs, [:body, :version, :topic_id, :parent_topic_coment_id, :user_id])
    |> validate_required([:body, :version])
  end
end
