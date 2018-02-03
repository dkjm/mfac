defmodule Mfac.Meetings do
  @moduledoc """
  The Meetings context.
  """

  import Ecto.Query, warn: false
  alias Mfac.Repo

  alias Mfac.Meetings.Topic

  @doc """
  Returns the list of topic.

  ## Examples

      iex> list_topic()
      [%Topic{}, ...]

  """
  def list_topics do
    Repo.all(Topic) |> Repo.preload([:owner, topic_comments: [:owner]])
  end

  @doc """
  Gets a single topic.

  Raises `Ecto.NoResultsError` if the Topic does not exist.

  ## Examples

      iex> get_topic!(123)
      %Topic{}

      iex> get_topic!(456)
      ** (Ecto.NoResultsError)

  """
  def get_topic!(id), do: Repo.get!(Topic, id)

  @doc """
  Creates a topic.

  ## Examples

      iex> create_topic(%{field: value})
      {:ok, %Topic{}}

      iex> create_topic(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_topic(attrs \\ %{}) do
    %Topic{}
    |> Topic.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a topic.

  ## Examples

      iex> update_topic(topic, %{field: new_value})
      {:ok, %Topic{}}

      iex> update_topic(topic, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_topic(%Topic{} = topic, attrs) do
    topic
    |> Topic.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Topic.

  ## Examples

      iex> delete_topic(topic)
      {:ok, %Topic{}}

      iex> delete_topic(topic)
      {:error, %Ecto.Changeset{}}

  """
  def delete_topic(%Topic{} = topic) do
    Repo.delete(topic)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking topic changes.

  ## Examples

      iex> change_topic(topic)
      %Ecto.Changeset{source: %Topic{}}

  """
  def change_topic(%Topic{} = topic) do
    Topic.changeset(topic, %{})
  end

  alias Mfac.Meetings.Stack

  @doc """
  Returns the list of stack.

  ## Examples

      iex> list_stack()
      [%Stack{}, ...]

  """
  def list_stacks do
    Repo.all(Stack)
  end

  @doc """
  Gets a single stack.

  Raises `Ecto.NoResultsError` if the Stack does not exist.

  ## Examples

      iex> get_stack!(123)
      %Stack{}

      iex> get_stack!(456)
      ** (Ecto.NoResultsError)

  """
  def get_stack!(id), do: Repo.get!(Stack, id)

  @doc """
  Creates a stack.

  ## Examples

      iex> create_stack(%{field: value})
      {:ok, %Stack{}}

      iex> create_stack(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_stack(attrs \\ %{}) do
    %Stack{}
    |> Stack.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a stack.

  ## Examples

      iex> update_stack(stack, %{field: new_value})
      {:ok, %Stack{}}

      iex> update_stack(stack, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_stack(%Stack{} = stack, attrs) do
    stack
    |> Stack.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Stack.

  ## Examples

      iex> delete_stack(stack)
      {:ok, %Stack{}}

      iex> delete_stack(stack)
      {:error, %Ecto.Changeset{}}

  """
  def delete_stack(%Stack{} = stack) do
    Repo.delete(stack)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking stack changes.

  ## Examples

      iex> change_stack(stack)
      %Ecto.Changeset{source: %Stack{}}

  """
  def change_stack(%Stack{} = stack) do
    Stack.changeset(stack, %{})
  end

  alias Mfac.Meetings.TopicComment

  @doc """
  Returns the list of topic_comment.

  ## Examples

      iex> list_topic_comment()
      [%TopicComment{}, ...]

  """
  def list_topic_comments do
    Repo.all(TopicComment)
  end

  @doc """
  Gets a single topic_comment.

  Raises `Ecto.NoResultsError` if the Topic comment does not exist.

  ## Examples

      iex> get_topic_comment!(123)
      %TopicComment{}

      iex> get_topic_comment!(456)
      ** (Ecto.NoResultsError)

  """
  def get_topic_comment!(id), do: Repo.get!(TopicComment, id)

  @doc """
  Creates a topic_comment.

  ## Examples

      iex> create_topic_comment(%{field: value})
      {:ok, %TopicComment{}}

      iex> create_topic_comment(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_topic_comment(attrs \\ %{}) do
    %TopicComment{}
    |> TopicComment.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a topic_comment.

  ## Examples

      iex> update_topic_comment(topic_comment, %{field: new_value})
      {:ok, %TopicComment{}}

      iex> update_topic_comment(topic_comment, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_topic_comment(%TopicComment{} = topic_comment, attrs) do
    topic_comment
    |> TopicComment.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a TopicComment.

  ## Examples

      iex> delete_topic_comment(topic_comment)
      {:ok, %TopicComment{}}

      iex> delete_topic_comment(topic_comment)
      {:error, %Ecto.Changeset{}}

  """
  def delete_topic_comment(%TopicComment{} = topic_comment) do
    Repo.delete(topic_comment)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking topic_comment changes.

  ## Examples

      iex> change_topic_comment(topic_comment)
      %Ecto.Changeset{source: %TopicComment{}}

  """
  def change_topic_comment(%TopicComment{} = topic_comment) do
    TopicComment.changeset(topic_comment, %{})
  end
end
